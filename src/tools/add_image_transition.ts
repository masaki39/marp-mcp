/**
 * Tool: add_image_transition
 * Inserts a full-screen image slide (using img-fullscreen CSS class) before the
 * specified slide to create image morphing transitions (HTML export only).
 *
 * Morphing works by placing the morph name in the alt text of both slides so Marp
 * renders matching img[alt~="name"] elements that the browser can animate with
 * CSS View Transitions.
 */

import { promises as fs } from "fs";
import { z } from "zod";
import matter from "gray-matter";
import { validateFilePath } from "../utils/path-validator.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import { parseFrontmatter, splitSlides, joinSlides } from "../utils/frontmatter.js";
import { findSlideIndexById } from "../utils/slide-id.js";
import type { ToolResponse } from "../types/common.js";
import { MAX_FILE_SIZE } from "../utils/constants.js";

export const addImageTransitionSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file (must end in .md)"),
  slideId: z.string().describe("UUID of the target slide (use read_slide to get IDs)"),
  imageUrl: z.string().describe("URL or path of the image — must match the image already in the target slide"),
});

const IMG_FULLSCREEN_CSS = `section.img-fullscreen {
  padding: 0;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
}
section.img-fullscreen img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}`;

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildMorphCss(morphName: string): string {
  return `img[alt~="${morphName}"] { view-transition-name: ${morphName}; }`;
}

function ensureFullscreenCss(existingStyle: string): string {
  if (existingStyle.includes("section.img-fullscreen")) return existingStyle;
  return existingStyle ? `${existingStyle}\n${IMG_FULLSCREEN_CSS}` : IMG_FULLSCREEN_CSS;
}

function getNextMorphName(existingStyle: string): string {
  const matches = existingStyle.match(/img-morph-(\d+)/g) ?? [];
  const usedNumbers = matches.map((m) => parseInt(m.replace("img-morph-", ""), 10));
  const next = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 1;
  return `img-morph-${next}`;
}

function prependMorphNameToAlt(slideContent: string, imageUrl: string, morphName: string): string {
  const urlEscaped = escapeRegex(imageUrl);
  // Match non-bg images containing the target URL
  const pattern = new RegExp(
    `!\\[(?!${escapeRegex(morphName)}(?:\\s|\\]))(?!bg\\s)([^\\]]*)\\]\\(${urlEscaped}((?:\\s+(?:'[^']*'|"[^"]*"))?)\\)`,
    "g"
  );
  return slideContent.replace(pattern, (_, alt, titlePart) => {
    const newAlt = alt.trim() ? `${morphName} ${alt.trim()}` : morphName;
    return `![${newAlt}](${imageUrl}${titlePart})`;
  });
}

export async function addImageTransition({
  filePath,
  slideId,
  imageUrl,
}: z.infer<typeof addImageTransitionSchema>): Promise<ToolResponse> {
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

  const targetIndex = findSlideIndexById(slides, slideId);
  if (targetIndex === -1) {
    return createErrorResponse(
      `Slide not found: "${slideId}". Use read_slide to list available slide IDs.`
    );
  }

  // Update frontmatter: add transition and morph CSS
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(frontmatter + "\n");
  } catch {
    return createErrorResponse("Failed to parse frontmatter YAML");
  }

  const data = parsed.data as Record<string, unknown>;
  data.transition = "fade";

  const existingStyle = typeof data.style === "string" ? data.style : "";
  const morphName = getNextMorphName(existingStyle);
  const morphCss = buildMorphCss(morphName);
  const styleWithFullscreen = ensureFullscreenCss(existingStyle);
  data.style = `${styleWithFullscreen}\n${morphCss}`;

  // Prepend morph name to alt of the content slide's image
  const contentSlide = slides[targetIndex];
  const imageFound = contentSlide.includes(imageUrl);
  slides[targetIndex] = imageFound
    ? prependMorphNameToAlt(contentSlide, imageUrl, morphName)
    : contentSlide;

  // Insert full-screen slide: uses img-fullscreen CSS class with inline img so
  // view-transition-name applies to a real DOM element (bg contain creates a CSS
  // background which cannot be animated by the View Transitions API).
  const bgSlide = `<!-- _class: img-fullscreen -->\n<!-- _paginate: false -->\n<!-- _header: "" -->\n<!-- _footer: "" -->\n\n![${morphName}](${imageUrl})`;
  slides.splice(targetIndex, 0, bgSlide);

  const newFrontmatter = matter.stringify("", data).trim();
  const newContent = joinSlides(newFrontmatter, slides);
  await fs.writeFile(filePath, newContent, "utf-8");

  return createSuccessResponse({
    message: "Image morphing transition added successfully.",
    file: filePath,
    bgSlideInsertedAt: targetIndex,
    morphName,
    imageTagged: imageFound,
    note: "Image morphing works in HTML export only (export_slide with format='html'). The morph name is placed in the alt text of both slides so Marp renders matching img elements for CSS View Transition morphing.",
  });
}
