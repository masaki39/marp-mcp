import { describe, it, expect } from "@jest/globals";
import { validateFilePath } from "../path-validator.js";

describe("validateFilePath", () => {
  it("accepts a clean absolute .md path", () => {
    expect(validateFilePath("/home/user/slides.md")).toBeNull();
  });

  it("rejects relative paths", () => {
    expect(validateFilePath("slides.md")).not.toBeNull();
    expect(validateFilePath("./slides.md")).not.toBeNull();
  });

  it("rejects path traversal with .. segments", () => {
    expect(validateFilePath("/home/user/../etc/slides.md")).not.toBeNull();
    expect(validateFilePath("/home/../slides.md")).not.toBeNull();
  });

  it("accepts paths with . segments (not traversal)", () => {
    expect(validateFilePath("/home/user/./slides.md")).toBeNull();
  });

  it("rejects wrong extension", () => {
    expect(validateFilePath("/home/user/slides.txt")).not.toBeNull();
  });

  it("accepts allowed custom extensions", () => {
    expect(validateFilePath("/home/user/theme.css", [".css"])).toBeNull();
    expect(validateFilePath("/home/user/output.html", [".html", ".pdf", ".pptx"])).toBeNull();
  });

  it("rejects wrong extension against custom list", () => {
    expect(validateFilePath("/home/user/slides.md", [".css"])).not.toBeNull();
  });
});
