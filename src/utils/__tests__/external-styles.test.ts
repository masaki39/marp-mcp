import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import { mkdtemp, rm, writeFile, mkdir } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { discoverExternalStyles } from "../external-styles.js";
import {
  clearExternalStyles,
  getAvailableStyleNames,
  getExternalStyles,
  getStyle,
} from "../../styles/index.js";

async function makeTempDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), "marp-mcp-external-"));
}

describe("discoverExternalStyles", () => {
  let cwd: string;

  beforeEach(async () => {
    clearExternalStyles();
    cwd = await makeTempDir();
  });

  afterEach(async () => {
    clearExternalStyles();
    await rm(cwd, { recursive: true, force: true });
  });

  it("registers a single style from a string themeSet", async () => {
    await writeFile(join(cwd, "sample.css"), "/* @theme sample */\nsection { background: #fff; }\n");
    await writeFile(join(cwd, ".marprc.yml"), "themeSet: ./sample.css\n");

    const result = await discoverExternalStyles(cwd);

    expect(result.registered).toEqual(["sample"]);
    expect(getStyle("sample")).toBeDefined();
    expect(getAvailableStyleNames()).toContain("sample");
    expect(getExternalStyles()).toHaveLength(1);
    expect(getExternalStyles()[0].source).toBe(join(cwd, "sample.css"));
  });

  it("registers every entry from an array themeSet", async () => {
    await writeFile(join(cwd, "a.css"), "/* @theme alpha */\n");
    await writeFile(join(cwd, "b.css"), "/* @theme beta */\n");
    await writeFile(
      join(cwd, ".marprc.yml"),
      "themeSet:\n  - ./a.css\n  - ./b.css\n"
    );

    const result = await discoverExternalStyles(cwd);

    expect(result.registered.sort()).toEqual(["alpha", "beta"]);
  });

  it("expands a directory themeSet to its top-level CSS files only", async () => {
    const themesDir = join(cwd, "themes");
    await mkdir(themesDir);
    await mkdir(join(themesDir, "nested"));
    await writeFile(join(themesDir, "top.css"), "/* @theme top */\n");
    await writeFile(join(themesDir, "nested", "deep.css"), "/* @theme deep */\n");
    await writeFile(join(cwd, ".marprc.yml"), "themeSet: ./themes\n");

    const result = await discoverExternalStyles(cwd);

    expect(result.registered).toEqual(["top"]);
    expect(getStyle("deep")).toBeUndefined();
  });

  it("skips CSS files without an @theme directive", async () => {
    await writeFile(join(cwd, "no-theme.css"), "section { color: red; }\n");
    await writeFile(join(cwd, ".marprc.yml"), "themeSet: ./no-theme.css\n");

    const result = await discoverExternalStyles(cwd);

    expect(result.registered).toEqual([]);
  });

  it("skips paths that do not exist", async () => {
    await writeFile(join(cwd, ".marprc.yml"), "themeSet: ./missing.css\n");

    const result = await discoverExternalStyles(cwd);

    expect(result.registered).toEqual([]);
  });

  it("returns an empty result for malformed YAML configuration", async () => {
    await writeFile(join(cwd, ".marprc.yml"), ":\n  - this is : not: valid: yaml: [\n");

    const result = await discoverExternalStyles(cwd);

    expect(result.registered).toEqual([]);
    expect(result.configPath).toBeNull();
  });

  it("returns an empty result when no config is found", async () => {
    const result = await discoverExternalStyles(cwd);
    expect(result).toEqual({ registered: [], configPath: null });
  });

  it("lowercases the registered name so CLI -s matches", async () => {
    await writeFile(join(cwd, "mixed.css"), "/* @theme MixedCase */\n");
    await writeFile(join(cwd, ".marprc.yml"), "themeSet: ./mixed.css\n");

    await discoverExternalStyles(cwd);

    expect(getStyle("mixedcase")).toBeDefined();
    expect(getStyle("MixedCase")).toBeUndefined();
  });
});
