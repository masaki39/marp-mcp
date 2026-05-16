import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { addImageTransition } from "../add_image_transition.js";
import { generateSlideIds } from "../generate_slide_ids.js";
import { setActiveTheme } from "../../themes/index.js";

let tempDir: string;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-img-trans-"));
  setActiveTheme("default");
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

const IMAGE_URL = "https://picsum.photos/1280/720";

async function makeFileWithIds(slides: string[]): Promise<{ filePath: string; ids: string[] }> {
  const filePath = path.join(tempDir, "slides.md");
  const content = [
    "---\nmarp: true\ntheme: default\n---",
    "",
    slides.join("\n\n---\n\n"),
    "",
  ].join("\n");
  await fs.writeFile(filePath, content, "utf-8");
  await generateSlideIds({ filePath });

  const updated = await fs.readFile(filePath, "utf-8");
  const ids = [...updated.matchAll(/slide-id:\s*([a-f0-9-]+)/g)].map((m) => m[1]);
  return { filePath, ids };
}

describe("add_image_transition", () => {
  it("returns error when file does not exist", async () => {
    const result = await addImageTransition({
      filePath: path.join(tempDir, "missing.md"),
      slideId: "fake-id",
      imageUrl: IMAGE_URL,
    });
    expect(result.isError).toBe(true);
  });

  it("returns error when slideId not found", async () => {
    const { filePath } = await makeFileWithIds(["## Slide\n\nContent"]);
    const result = await addImageTransition({
      filePath,
      slideId: "nonexistent-id",
      imageUrl: IMAGE_URL,
    });
    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("Slide not found");
  });

  it("inserts bg slide before target slide", async () => {
    const { filePath, ids } = await makeFileWithIds([
      "## Slide A\n\nContent",
      `## Slide B\n\n![center h:350](${IMAGE_URL})`,
    ]);

    const result = await addImageTransition({
      filePath,
      slideId: ids[1],
      imageUrl: IMAGE_URL,
    });
    expect(result.isError).toBeUndefined();

    const updated = await fs.readFile(filePath, "utf-8");
    // Full-screen slide uses img-fullscreen class with inline img (not bg contain)
    expect(updated).toContain("_class: img-fullscreen");
    expect(updated).toMatch(/!\[img-morph-\d+\]\(https:\/\/picsum\.photos\/1280\/720\)/);
    expect(updated).toContain("_paginate: false");
  });

  it("adds transition: fade to frontmatter", async () => {
    const { filePath, ids } = await makeFileWithIds([
      `## Slide\n\n![center h:350](${IMAGE_URL})`,
    ]);

    await addImageTransition({ filePath, slideId: ids[0], imageUrl: IMAGE_URL });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toContain("transition: fade");
  });

  it("injects view-transition CSS into frontmatter style (alt-based)", async () => {
    const { filePath, ids } = await makeFileWithIds([
      `## Slide\n\n![center h:350](${IMAGE_URL})`,
    ]);

    await addImageTransition({ filePath, slideId: ids[0], imageUrl: IMAGE_URL });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toMatch(/img\[alt~="img-morph-\d+"\]/);
    expect(updated).toMatch(/view-transition-name: img-morph-\d+/);
  });

  it("prepends morph name to alt of the content slide image", async () => {
    const { filePath, ids } = await makeFileWithIds([
      `## Slide\n\n![center h:350](${IMAGE_URL})`,
    ]);

    await addImageTransition({ filePath, slideId: ids[0], imageUrl: IMAGE_URL });

    const updated = await fs.readFile(filePath, "utf-8");
    // Content slide: morph name prepended to alt
    expect(updated).toMatch(/!\[img-morph-\d+ center h:350\]\(https:\/\/picsum\.photos\/1280\/720\)/);
  });

  it("full-screen slide has morph name as alt and img-fullscreen class", async () => {
    const { filePath, ids } = await makeFileWithIds([
      `## Slide\n\n![center h:350](${IMAGE_URL})`,
    ]);

    await addImageTransition({ filePath, slideId: ids[0], imageUrl: IMAGE_URL });

    const updated = await fs.readFile(filePath, "utf-8");
    // Full-screen slide: only morph name in alt, uses img-fullscreen class
    expect(updated).toMatch(/!\[img-morph-\d+\]\(https:\/\/picsum\.photos\/1280\/720\)/);
    expect(updated).toContain("_class: img-fullscreen");
    // img-fullscreen CSS injected into frontmatter style
    expect(updated).toContain("section.img-fullscreen");
  });

  it("uses unique morph names on repeated calls", async () => {
    const { filePath, ids } = await makeFileWithIds([
      `## Slide A\n\n![center h:350](${IMAGE_URL})`,
      `## Slide B\n\n![center h:350](${IMAGE_URL})`,
    ]);

    await addImageTransition({ filePath, slideId: ids[0], imageUrl: IMAGE_URL });
    await addImageTransition({ filePath, slideId: ids[1], imageUrl: IMAGE_URL });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toContain("img-morph-1");
    expect(updated).toContain("img-morph-2");
  });
});
