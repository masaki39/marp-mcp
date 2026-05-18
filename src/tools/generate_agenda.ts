/**
 * Tool: generate_agenda
 * Auto-generates an agenda slide from section slides and inserts it before the first section.
 * Also adds numbered icons to each section slide and injects view-transition CSS
 * into frontmatter (HTML export only).
 */

import { promises as fs } from "fs";
import { z } from "zod";
import matter from "gray-matter";
import { validateFilePath } from "../utils/path-validator.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import { parseFrontmatter, splitSlides, joinSlides } from "../utils/frontmatter.js";
import type { ToolResponse } from "../types/common.js";
import { MAX_FILE_SIZE } from "../utils/constants.js";

export const generateAgendaSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file (must end in .md)"),
  sectionClass: z
    .string()
    .optional()
    .default("acad-section")
    .describe("CSS class name used on section slides (default: acad-section)"),
  agendaHeading: z
    .string()
    .optional()
    .default("Agenda")
    .describe("Heading text for the generated agenda slide"),
});

const ICON_BASE = "https://icongr.am/material/numeric-{N}-circle.svg";
const ICON_COLOR_AGENDA = "666666";
const ICON_COLOR_SECTION = "ffffff";

export function buildStepCss(count: number): string {
  const transitionRules = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return `img[alt="${n}"] { view-transition-name: step-${n}; }`;
  }).join("\n");

  return `img[title~="step"] {
  height: 1em;
  position: relative;
  top: -0.1em;
  vertical-align: middle;
  width: 1em;
}
${transitionRules}`;
}

function iconUrl(n: number, color: string): string {
  return `${ICON_BASE.replace("{N}", String(n))}?color=${color}`;
}

function extractSectionTitle(slideContent: string): string {
  const lines = slideContent.split("\n");
  for (const line of lines) {
    const m = line.match(/^#{1,3}\s+(.+)/);
    if (m) return m[1].trim();
  }
  return "Section";
}

function addSectionIcon(slideContent: string, n: number): string {
  // Skip if slide already has a step icon
  if (slideContent.includes("'step'") || slideContent.includes('"step"')) {
    return slideContent;
  }

  // Remove acad-section-num span (the numbered icon replaces this role)
  const cleaned = slideContent.replace(/<span class="acad-section-num">[^<]*<\/span>\n*/g, "");

  const icon = `![${n} w:192 h:192](${iconUrl(n, ICON_COLOR_SECTION)} 'step')`;
  const lines = cleaned.split("\n");
  const headingIdx = lines.findIndex((l) => /^#{1,3}\s/.test(l));

  if (headingIdx === -1) {
    return `${cleaned.trim()}\n\n${icon}`;
  }

  lines.splice(headingIdx, 0, icon, "");
  return lines.join("\n");
}

export async function generateAgenda({
  filePath,
  sectionClass,
  agendaHeading,
}: z.infer<typeof generateAgendaSchema>): Promise<ToolResponse> {
  const pathError = validateFilePath(filePath);
  if (pathError) return createErrorResponse(pathError);

  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    return createErrorResponse(
      `Could not read file: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (raw.length > MAX_FILE_SIZE) {
    return createErrorResponse(
      `File too large (${raw.length} bytes, max ${MAX_FILE_SIZE} bytes)`
    );
  }

  const { frontmatter, body } = parseFrontmatter(raw);
  const slides = splitSlides(body);

  // Find section slides by _class comment
  const classPattern = new RegExp(`<!--\\s*_class:\\s*${sectionClass}\\s*-->`);
  const sectionIndices: number[] = [];
  for (let i = 0; i < slides.length; i++) {
    if (classPattern.test(slides[i])) {
      sectionIndices.push(i);
    }
  }

  if (sectionIndices.length === 0) {
    return createErrorResponse(
      `No section slides found with class "${sectionClass}". ` +
        `Add <!-- _class: ${sectionClass} --> to section slides first.`
    );
  }

  // Extract titles from section slides
  const sectionTitles = sectionIndices.map((i) => extractSectionTitle(slides[i]));

  // Add numbered icons to each section slide (enables view-transition morphing)
  sectionIndices.forEach((sectionIdx, i) => {
    slides[sectionIdx] = addSectionIcon(slides[sectionIdx], i + 1);
  });

  // Build agenda slide content
  const listItems = sectionTitles
    .map((title, i) => {
      const n = i + 1;
      return `- ![${n}](${iconUrl(n, ICON_COLOR_AGENDA)} 'step') ${title}`;
    })
    .join("\n");

  const agendaSlide = `## ${agendaHeading}\n\n${listItems}`;

  // Insert agenda slide before each section slide (reverse order preserves indices)
  for (const idx of [...sectionIndices].reverse()) {
    slides.splice(idx, 0, agendaSlide);
  }

  // Update frontmatter: add transition and step CSS
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(frontmatter + "\n");
  } catch {
    return createErrorResponse("Failed to parse frontmatter YAML");
  }

  const data = parsed.data as Record<string, unknown>;
  data.transition = "fade";

  const stepCss = buildStepCss(sectionIndices.length);
  const existingStyle = typeof data.style === "string" ? data.style : "";
  if (!existingStyle.includes('img[title~="step"]')) {
    data.style = existingStyle ? `${existingStyle}\n${stepCss}` : stepCss;
  }

  const newFrontmatter = matter.stringify("", data).trim();
  const newContent = joinSlides(newFrontmatter, slides);

  await fs.writeFile(filePath, newContent, "utf-8");

  return createSuccessResponse({
    message: `Agenda slides generated and inserted before each of ${sectionIndices.length} section(s). Section slides updated with numbered icons for view-transition morphing.`,
    file: filePath,
    agendaInsertedBeforeSections: sectionIndices,
    sectionsFound: sectionIndices.length,
    sectionTitles,
    note: "View transitions (morphing icons) work in HTML export only (export_slide with format='html').",
  });
}
