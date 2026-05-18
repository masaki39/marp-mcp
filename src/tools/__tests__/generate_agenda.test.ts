import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { generateAgenda } from "../generate_agenda.js";
import { setActiveTheme } from "../../themes/index.js";

const DEFAULTS = { sectionClass: "acad-section", agendaHeading: "Agenda" } as const;

let tempDir: string;

beforeEach(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-agenda-"));
  setActiveTheme("default");
});

afterEach(async () => {
  await fs.rm(tempDir, { recursive: true, force: true });
});

function makePresentation(slides: string[]): string {
  return [
    "---",
    "marp: true",
    "theme: default",
    "---",
    "",
    slides.join("\n\n---\n\n"),
    "",
  ].join("\n");
}

describe("generate_agenda", () => {
  it("returns error when file does not exist", async () => {
    const result = await generateAgenda({
      ...DEFAULTS,
      filePath: path.join(tempDir, "missing.md"),
    });
    expect(result.isError).toBe(true);
  });

  it("returns error when no section slides found", async () => {
    const filePath = path.join(tempDir, "no-sections.md");
    await fs.writeFile(filePath, makePresentation(["## Intro\n\nContent"]), "utf-8");

    const result = await generateAgenda({ filePath, ...DEFAULTS });
    expect(result.isError).toBe(true);
    const text = result.content[0].text;
    expect(text).toContain("No section slides found");
  });

  it("inserts agenda slide before each section slide", async () => {
    const filePath = path.join(tempDir, "slides.md");
    const content = makePresentation([
      "## Title\n\nAuthor",
      "<!-- _class: acad-section -->\n\n## Methods\nSubtitle",
      "## Content\n\nBody",
      "<!-- _class: acad-section -->\n\n## Results\nSubtitle",
    ]);
    await fs.writeFile(filePath, content, "utf-8");

    const result = await generateAgenda({ filePath, ...DEFAULTS });
    expect(result.isError).toBeUndefined();

    const updated = await fs.readFile(filePath, "utf-8");
    // Agenda should appear twice (once before each section)
    const agendaCount = (updated.match(/## Agenda/g) ?? []).length;
    expect(agendaCount).toBe(2);
    expect(updated).toContain("Methods");
    expect(updated).toContain("Results");
    // Icons for agenda (gray)
    expect(updated).toContain("666666");
    // transition: fade should be in frontmatter
    expect(updated).toContain("transition: fade");
    // view-transition CSS should be injected
    expect(updated).toContain('img[title~="step"]');
    expect(updated).toContain("view-transition-name: step-1");
    expect(updated).toContain("view-transition-name: step-2");
  });

  it("adds section icons to section slides for morphing", async () => {
    const filePath = path.join(tempDir, "slides.md");
    const content = makePresentation([
      "<!-- _class: acad-section -->\n\n## Methods\nSubtitle",
      "<!-- _class: acad-section -->\n\n## Results\nSubtitle",
    ]);
    await fs.writeFile(filePath, content, "utf-8");

    await generateAgenda({ filePath, ...DEFAULTS });

    const updated = await fs.readFile(filePath, "utf-8");
    // Section slides should have white icons
    expect(updated).toContain("ffffff");
    expect(updated).toContain("w:192 h:192");
    // Icon alt text matches section number
    expect(updated).toMatch(/!\[1 w:192 h:192\]/);
    expect(updated).toMatch(/!\[2 w:192 h:192\]/);
  });

  it("does not add icon to section slide that already has one", async () => {
    const filePath = path.join(tempDir, "slides.md");
    const existing = "<!-- _class: acad-section -->\n\n![1 w:192 h:192](url 'step')\n\n## Methods";
    const content = makePresentation([existing]);
    await fs.writeFile(filePath, content, "utf-8");

    await generateAgenda({ filePath, ...DEFAULTS });

    const updated = await fs.readFile(filePath, "utf-8");
    // Should not add a second icon
    const iconMatches = (updated.match(/w:192 h:192/g) ?? []).length;
    expect(iconMatches).toBe(1);
  });

  it("removes acad-section-num span when adding numbered icon", async () => {
    const filePath = path.join(tempDir, "slides.md");
    const content = makePresentation([
      '<!-- _class: acad-section -->\n\n<span class="acad-section-num">01</span>\n\n## Methods',
    ]);
    await fs.writeFile(filePath, content, "utf-8");

    await generateAgenda({ filePath, ...DEFAULTS });

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).not.toContain("acad-section-num");
    expect(updated).toContain("w:192 h:192");
  });

  it("respects custom sectionClass and agendaHeading", async () => {
    const filePath = path.join(tempDir, "slides.md");
    const content = makePresentation([
      "<!-- _class: lead -->\n\n## Section One",
    ]);
    await fs.writeFile(filePath, content, "utf-8");

    const result = await generateAgenda({
      ...DEFAULTS,
      filePath,
      sectionClass: "lead",
      agendaHeading: "Today's Topics",
    });
    expect(result.isError).toBeUndefined();

    const updated = await fs.readFile(filePath, "utf-8");
    expect(updated).toContain("## Today's Topics");
  });

  it("is idempotent: calling twice does not duplicate agenda slides", async () => {
    const filePath = path.join(tempDir, "slides.md");
    const content = makePresentation([
      "<!-- _class: acad-section -->\n\n## Methods",
      "<!-- _class: acad-section -->\n\n## Results",
    ]);
    await fs.writeFile(filePath, content, "utf-8");

    await generateAgenda({ filePath, ...DEFAULTS });
    await generateAgenda({ filePath, ...DEFAULTS });

    const updated = await fs.readFile(filePath, "utf-8");
    // Each section should have exactly one agenda slide before it (not two)
    const agendaCount = (updated.match(/## Agenda/g) ?? []).length;
    expect(agendaCount).toBe(2);
  });

  it("appends step CSS without duplicating if called twice", async () => {
    const filePath = path.join(tempDir, "slides.md");
    const content = makePresentation([
      "<!-- _class: acad-section -->\n\n## Methods",
    ]);
    await fs.writeFile(filePath, content, "utf-8");

    await generateAgenda({ filePath, ...DEFAULTS });
    await generateAgenda({ filePath, ...DEFAULTS });

    const updated = await fs.readFile(filePath, "utf-8");
    const cssOccurrences = (updated.match(/img\[title~="step"\]/g) ?? []).length;
    expect(cssOccurrences).toBe(1);
  });
});
