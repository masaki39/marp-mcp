import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { setFrontmatter } from "../set_frontmatter.js";
import { setActiveTheme } from "../../themes/index.js";
import { setActiveStyle } from "../../styles/index.js";

describe("setFrontmatter", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-frontmatter-"));
    setActiveTheme("default");
    setActiveStyle("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("creates the required frontmatter when missing", async () => {
    const filePath = path.join(tempDir, "slides.md");
    await fs.writeFile(filePath, "# Slide 1\n", "utf-8");

    await setFrontmatter({ filePath });

    const updated = await fs.readFile(filePath, "utf-8");
    // Check for required fields without being strict about formatting
    expect(updated).toContain("marp: true");
    expect(updated).toContain("theme: default");
    expect(updated).toMatch(/header:\s*['"']?['"']?/); // header can be empty string with quotes or without
    expect(updated).toContain("paginate: false");
    expect(updated.trimEnd()).toContain("# Slide 1");
  });

  it("preserves existing header and paginate when values are omitted", async () => {
    const filePath = path.join(tempDir, "existing.md");
    const original = [
      "---",
      "marp: true",
      "theme: uncover",
      "header: Existing header",
      "paginate: true",
      "custom: keep-me",
      "---",
      "",
      "# Slide",
    ].join("\n");
    await fs.writeFile(filePath, original, "utf-8");
    setActiveTheme("gaia");

    await setFrontmatter({ filePath });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toContain("theme: gaia");
    expect(updated).toContain("header: Existing header");
    expect(updated).toContain("paginate: true");
    expect(updated).toContain("custom: keep-me");
  });

  it("overrides header and paginate when provided", async () => {
    const filePath = path.join(tempDir, "override.md");
    const original = [
      "---",
      "marp: true",
      "theme: default",
      "---",
      "",
      "# Slide",
    ].join("\n");
    await fs.writeFile(filePath, original, "utf-8");
    setActiveTheme("gaia");

    await setFrontmatter({
      filePath,
      header: "Kickoff: FY25",
      paginate: true,
    });

    const updated = await fs.readFile(filePath, "utf-8");
    // Check that the header contains the value (gray-matter may use single or double quotes)
    expect(updated).toMatch(/header:\s*['"]Kickoff: FY25['"]/);
    expect(updated).toContain("paginate: true");
    expect(updated).toContain("theme: gaia");
  });

  it("injects style CSS when rich style is active", async () => {
    const filePath = path.join(tempDir, "styled.md");
    await fs.writeFile(filePath, "# Slide 1\n", "utf-8");
    setActiveStyle("rich");

    const result = await setFrontmatter({ filePath });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toContain("style:");
    // Check response includes style name
    const responseText = result.content[0].text;
    const response = JSON.parse(responseText);
    expect(response.style).toBe("rich");
  });

  it("does not inject style CSS when default style is active", async () => {
    const filePath = path.join(tempDir, "nostyle.md");
    await fs.writeFile(filePath, "# Slide 1\n", "utf-8");
    setActiveStyle("default");

    const result = await setFrontmatter({ filePath });

    const updated = await fs.readFile(filePath, "utf-8");
    // style field should not be present (no CSS to inject)
    expect(updated).not.toMatch(/^style:/m);
    // Response should still include style name
    const responseText = result.content[0].text;
    const response = JSON.parse(responseText);
    expect(response.style).toBe("default");
  });
});
