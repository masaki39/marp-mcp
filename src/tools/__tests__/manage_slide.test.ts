import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { manageSlide } from "../manage_slide.js";
import { setActiveTheme } from "../../themes/index.js";

const FRONTMATTER = ["---", "marp: true", "theme: default", "---", ""].join("\n");

async function readSlides(filePath: string): Promise<string> {
  return fs.readFile(filePath, "utf-8");
}

describe("manageSlide - notes", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-manage-slide-"));
    setActiveTheme("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("appends notes when inserting slides", async () => {
    const filePath = path.join(tempDir, "insert.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n`, "utf-8");

    await manageSlide({
      filePath,
      layoutType: "title",
      params: { heading: "Intro" },
      note: "Remember to greet the audience\nShare agenda briefly",
    });

    const updated = await readSlides(filePath);
    expect(updated).toContain("<!--");
    expect(updated).toContain("Remember to greet the audience");
    expect(updated).toContain("Share agenda briefly");
    expect(updated.trimEnd().endsWith("-->")).toBe(true);
  });

  it("appends notes when replacing slides", async () => {
    const filePath = path.join(tempDir, "replace.md");
    const existingSlideId = "aabbccdd-1234";
    const initialContent = [
      FRONTMATTER,
      `<!-- slide-id: ${existingSlideId} -->`,
      "",
      "# Old heading",
      "",
      "Legacy body",
    ].join("\n");
    await fs.writeFile(filePath, `${initialContent}\n`, "utf-8");

    await manageSlide({
      filePath,
      layoutType: "title",
      params: { heading: "Updated title" },
      mode: "replace",
      slideId: existingSlideId,
      note: "New talking points",
    });

    const updated = await readSlides(filePath);
    expect(updated).toContain("# Updated title");
    expect(updated).toContain("<!--\nNew talking points\n-->");
  });
});

describe("manageSlide - move mode", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-manage-slide-move-"));
    setActiveTheme("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  async function makeThreeSlideFile(dir: string): Promise<{ filePath: string; ids: string[] }> {
    const ids = [
      "aaaaaaaa-0000-0000-0000-000000000001",
      "aaaaaaaa-0000-0000-0000-000000000002",
      "aaaaaaaa-0000-0000-0000-000000000003",
    ];
    const body = [
      `<!-- slide-id: ${ids[0]} -->\n\n# Slide A`,
      `<!-- slide-id: ${ids[1]} -->\n\n# Slide B`,
      `<!-- slide-id: ${ids[2]} -->\n\n# Slide C`,
    ].join("\n\n---\n\n");
    const filePath = path.join(dir, "three.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n${body}`, "utf-8");
    return { filePath, ids };
  }

  it("moves slide to end", async () => {
    const { filePath, ids } = await makeThreeSlideFile(tempDir);
    await manageSlide({ filePath, mode: "move", slideId: ids[0], targetPosition: "end" });
    const content = await fs.readFile(filePath, "utf-8");
    const aPos = content.indexOf("Slide A");
    const bPos = content.indexOf("Slide B");
    const cPos = content.indexOf("Slide C");
    expect(bPos).toBeLessThan(cPos);
    expect(cPos).toBeLessThan(aPos);
  });

  it("moves slide to start", async () => {
    const { filePath, ids } = await makeThreeSlideFile(tempDir);
    await manageSlide({ filePath, mode: "move", slideId: ids[2], targetPosition: "start" });
    const content = await fs.readFile(filePath, "utf-8");
    const aPos = content.indexOf("Slide A");
    const bPos = content.indexOf("Slide B");
    const cPos = content.indexOf("Slide C");
    expect(cPos).toBeLessThan(aPos);
    expect(aPos).toBeLessThan(bPos);
  });

  it("moves slide after a target", async () => {
    const { filePath, ids } = await makeThreeSlideFile(tempDir);
    // Move A after C → order: B C A
    await manageSlide({ filePath, mode: "move", slideId: ids[0], targetPosition: "after", targetSlideId: ids[2] });
    const content = await fs.readFile(filePath, "utf-8");
    const aPos = content.indexOf("Slide A");
    const bPos = content.indexOf("Slide B");
    const cPos = content.indexOf("Slide C");
    expect(bPos).toBeLessThan(cPos);
    expect(cPos).toBeLessThan(aPos);
  });

  it("moves slide before a target", async () => {
    const { filePath, ids } = await makeThreeSlideFile(tempDir);
    // Move C before A → order: C A B
    await manageSlide({ filePath, mode: "move", slideId: ids[2], targetPosition: "before", targetSlideId: ids[0] });
    const content = await fs.readFile(filePath, "utf-8");
    const aPos = content.indexOf("Slide A");
    const bPos = content.indexOf("Slide B");
    const cPos = content.indexOf("Slide C");
    expect(cPos).toBeLessThan(aPos);
    expect(aPos).toBeLessThan(bPos);
  });

  it("preserves slide ID after move", async () => {
    const { filePath, ids } = await makeThreeSlideFile(tempDir);
    await manageSlide({ filePath, mode: "move", slideId: ids[0], targetPosition: "end" });
    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain(`slide-id: ${ids[0]}`);
  });

  it("returns error when slideId missing", async () => {
    const { filePath } = await makeThreeSlideFile(tempDir);
    const result = await manageSlide({ filePath, mode: "move" });
    expect(result.isError).toBe(true);
  });

  it("returns error when targetSlideId not found for after", async () => {
    const { filePath, ids } = await makeThreeSlideFile(tempDir);
    const result = await manageSlide({ filePath, mode: "move", slideId: ids[0], targetPosition: "after", targetSlideId: "nonexistent" });
    expect(result.isError).toBe(true);
  });
});
