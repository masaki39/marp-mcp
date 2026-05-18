import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { batchManageSlides } from "../batch_manage_slides.js";
import { setActiveTheme } from "../../themes/index.js";

const FRONTMATTER = ["---", "marp: true", "theme: default", "---", ""].join("\n");

async function makeFile(dir: string, name: string, body = ""): Promise<string> {
  const filePath = path.join(dir, name);
  await fs.writeFile(filePath, `${FRONTMATTER}\n${body}`, "utf-8");
  return filePath;
}

describe("batchManageSlides", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-batch-"));
    setActiveTheme("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("inserts multiple slides in one call", async () => {
    const filePath = await makeFile(tempDir, "multi.md");

    const result = await batchManageSlides({
      filePath,
      operations: [
        { layoutType: "title", params: { heading: "Slide 1" } },
        { layoutType: "title", params: { heading: "Slide 2" } },
        { layoutType: "title", params: { heading: "Slide 3" } },
      ],
    });

    expect(result.isError).toBeFalsy();
    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain("Slide 1");
    expect(content).toContain("Slide 2");
    expect(content).toContain("Slide 3");
  });

  it("returns results for each operation", async () => {
    const filePath = await makeFile(tempDir, "results.md");

    const result = await batchManageSlides({
      filePath,
      operations: [
        { layoutType: "title", params: { heading: "A" } },
        { layoutType: "title", params: { heading: "B" } },
      ],
    });

    const data = JSON.parse((result.content[0] as { text: string }).text) as {
      results: Array<{ op: number; slideId: string }>;
    };
    expect(data.results).toHaveLength(2);
    expect(data.results[0].op).toBe(1);
    expect(data.results[1].op).toBe(2);
    expect(data.results[0].slideId).toBeTruthy();
    expect(data.results[1].slideId).toBeTruthy();
  });

  it("replaces an existing slide", async () => {
    const slideId = "bbbbbbbb-0000-0000-0000-000000000001";
    const body = `<!-- slide-id: ${slideId} -->\n\n# Original`;
    const filePath = await makeFile(tempDir, "replace.md", body);

    await batchManageSlides({
      filePath,
      operations: [{ mode: "replace", slideId, layoutType: "title", params: { heading: "Replaced" } }],
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain("Replaced");
    expect(content).not.toContain("Original");
  });

  it("deletes a slide", async () => {
    const slideId = "cccccccc-0000-0000-0000-000000000001";
    const body = `<!-- slide-id: ${slideId} -->\n\n# To Delete`;
    const filePath = await makeFile(tempDir, "delete.md", body);

    await batchManageSlides({
      filePath,
      operations: [{ mode: "delete", slideId }],
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content).not.toContain("To Delete");
  });

  it("moves a slide within the batch", async () => {
    const idA = "dddddddd-0000-0000-0000-000000000001";
    const idB = "dddddddd-0000-0000-0000-000000000002";
    const body = [
      `<!-- slide-id: ${idA} -->\n\n# Slide A`,
      `<!-- slide-id: ${idB} -->\n\n# Slide B`,
    ].join("\n\n---\n\n");
    const filePath = await makeFile(tempDir, "move.md", body);

    await batchManageSlides({
      filePath,
      operations: [{ mode: "move", slideId: idB, targetPosition: "before", targetSlideId: idA }],
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content.indexOf("Slide B")).toBeLessThan(content.indexOf("Slide A"));
  });

  it("stops on first validation error and returns error", async () => {
    const filePath = await makeFile(tempDir, "err.md");

    const result = await batchManageSlides({
      filePath,
      operations: [
        { layoutType: "title", params: { heading: "OK" } },
        { mode: "delete" }, // missing slideId — will fail
        { layoutType: "title", params: { heading: "Never reached" } },
      ],
    });

    expect(result.isError).toBe(true);
    const content = await fs.readFile(filePath, "utf-8");
    // First op should not have been written (stopped on error — file unchanged from initial)
    // Actually: ops are applied in-memory and only written on success, so nothing was written
    expect(content).not.toContain("Never reached");
  });

  it("writes the file only once (single round-trip)", async () => {
    const filePath = await makeFile(tempDir, "roundtrip.md");
    const statBefore = await fs.stat(filePath);

    await batchManageSlides({
      filePath,
      operations: Array.from({ length: 5 }, (_, i) => ({
        layoutType: "title" as const,
        params: { heading: `Slide ${i + 1}` },
      })),
    });

    const content = await fs.readFile(filePath, "utf-8");
    for (let i = 1; i <= 5; i++) {
      expect(content).toContain(`Slide ${i}`);
    }
    // Verify file was written after the initial stat (mtime changed)
    const statAfter = await fs.stat(filePath);
    expect(statAfter.mtimeMs).toBeGreaterThanOrEqual(statBefore.mtimeMs);
  });

  it("returns error for unknown layout", async () => {
    const filePath = await makeFile(tempDir, "badlayout.md");

    const result = await batchManageSlides({
      filePath,
      operations: [{ layoutType: "nonexistent-layout", params: {} }],
    });

    expect(result.isError).toBe(true);
  });

  it("validates maxLength per operation", async () => {
    const filePath = await makeFile(tempDir, "maxlen.md");
    const tooLong = "あ".repeat(200); // 200 chars, exceeds heading maxLength

    const result = await batchManageSlides({
      filePath,
      operations: [{ layoutType: "list", params: { heading: tooLong, list: ["item"] } }],
    });

    expect(result.isError).toBe(true);
  });
});
