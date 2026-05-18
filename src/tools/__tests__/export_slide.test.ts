import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { exportSlide } from "../export_slide.js";
import { setActiveTheme } from "../../themes/index.js";

const MINIMAL_MARP = [
  "---",
  "marp: true",
  "theme: default",
  "---",
  "",
  "# Hello World",
  "",
  "Test slide content",
  "",
].join("\n");

describe("exportSlide", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-export-"));
    setActiveTheme("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("exports to HTML with default output path", async () => {
    const filePath = path.join(tempDir, "test.md");
    await fs.writeFile(filePath, MINIMAL_MARP, "utf-8");

    const result = await exportSlide({ filePath, format: "html" });

    expect(result.isError).toBeFalsy();
    const data = JSON.parse(result.content[0].text);
    expect(data.format).toBe("html");
    expect(data.outputPath).toBe(path.join(tempDir, "test.html"));

    const outputExists = await fs.access(data.outputPath).then(() => true).catch(() => false);
    expect(outputExists).toBe(true);

    const outputContent = await fs.readFile(data.outputPath, "utf-8");
    expect(outputContent).toContain("<html");
    expect(outputContent).toContain("Hello World");
  }, 30000);

  it("exports to HTML with custom output path", async () => {
    const filePath = path.join(tempDir, "test.md");
    const outputPath = path.join(tempDir, "custom-output.html");
    await fs.writeFile(filePath, MINIMAL_MARP, "utf-8");

    const result = await exportSlide({ filePath, format: "html", outputPath });

    expect(result.isError).toBeFalsy();
    const data = JSON.parse(result.content[0].text);
    expect(data.outputPath).toBe(outputPath);

    const outputExists = await fs.access(outputPath).then(() => true).catch(() => false);
    expect(outputExists).toBe(true);
  }, 30000);

  it("returns error when source file does not exist", async () => {
    const filePath = path.join(tempDir, "nonexistent.md");

    const result = await exportSlide({ filePath, format: "html" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("File not found");
  });

  it("returns error for invalid file path (not absolute)", async () => {
    const result = await exportSlide({ filePath: "relative/path.md", format: "html" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("absolute");
  });

  it("returns error for invalid file extension", async () => {
    const result = await exportSlide({ filePath: "/tmp/test.txt", format: "html" });

    expect(result.isError).toBe(true);
    expect(result.content[0].text).toContain("extension");
  });

  it("attempts PDF export (succeeds with browser, fails gracefully without)", async () => {
    const filePath = path.join(tempDir, "test.md");
    await fs.writeFile(filePath, MINIMAL_MARP, "utf-8");

    const result = await exportSlide({ filePath, format: "pdf" });

    // PDF requires a browser; in CI without Chrome, it fails with a meaningful error.
    // We just verify the result structure is correct either way.
    if (result.isError) {
      // Should fail with a descriptive marp error, not an unexpected crash
      expect(result.content[0].text).toContain("Export failed");
    } else {
      const data = JSON.parse(result.content[0].text);
      expect(data.format).toBe("pdf");
      expect(data.outputPath).toBe(path.join(tempDir, "test.pdf"));
      const stat = await fs.stat(data.outputPath);
      expect(stat.size).toBeGreaterThan(0);
    }
  }, 60000);
});
