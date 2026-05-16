/**
 * Tool: manage_slide
 * Manage slides in a Marp presentation file (insert, replace, delete) using slide IDs
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { getLayout, getLayoutNames } from "./list_layouts.js";
import { getActiveTheme, getTheme } from "../themes/index.js";
import { getActiveStyle, getStyle } from "../styles/index.js";
import { ensureSlideId, findSlideIndexById, generateSlideId } from "../utils/slide-id.js";
import { validateFilePath } from "../utils/path-validator.js";
import { parseFrontmatter, splitSlides, joinSlides } from "../utils/frontmatter.js";
import { MAX_FILE_SIZE } from "../utils/constants.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

export const manageSlideSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file (must end in .md)"),
  layoutType: z
    .string()
    .optional()
    .describe(
      "Layout type to use for this slide. Call list_layouts first to see all available layouts for the active theme/style. " +
        "Common values: 'title', 'section', 'content', 'list', 'table', 'two-column', 'statistics', 'quote'. " +
        "Not required for delete mode."
    ),
  params: z
    .record(z.any())
    .optional()
    .describe(
      "Parameters for the layout template as a key-value object. " +
        "Call list_layouts to get required and optional parameter names and types for each layout. " +
        'Example: {"heading": "My Title", "body": "Some content"}. Not required for delete mode.'
    ),
  mode: z
    .enum(["insert", "replace", "delete"])
    .optional()
    .describe(
      "Operation mode: 'insert' (default) adds a new slide, 'replace' overwrites an existing slide keeping its ID, " +
        "'delete' removes a slide. replace and delete both require slideId."
    ),
  position: z
    .enum(["end", "start", "after", "before"])
    .optional()
    .describe(
      "Insertion position (insert mode only): 'end' (default) appends to deck, 'start' prepends, " +
        "'after' inserts after slideId, 'before' inserts before slideId. Requires slideId for after/before."
    ),
  slideId: z
    .string()
    .optional()
    .describe(
      "Slide ID (the UUID from a '<!-- slide-id: ... -->' comment). Required for: position 'after', " +
        "position 'before', mode 'replace', mode 'delete'. Use read_slide to discover existing slide IDs."
    ),
  note: z
    .string()
    .optional()
    .describe(
      "Speaker notes appended as an HTML comment block (<!-- ... -->) at the end of the slide. " +
        'Supports multiple lines. Example: "Key point to emphasize\\nRemember to pause here"'
    ),
  theme: z
    .string()
    .optional()
    .describe(
      "Theme name to use for this call (e.g. 'gaia', 'uncover'). " +
        "Overrides server default for this call only. Omit to use server default."
    ),
  style: z
    .string()
    .optional()
    .describe(
      "Style name to use for this call (e.g. 'rich', 'minimal', 'dark'). " +
        "Overrides server default for this call only. Omit to use server default."
    ),
});

/**
 * Ensures all slides in the array have IDs
 */
function ensureAllSlidesHaveIds(slides: string[]): string[] {
  return slides.map(slide => ensureSlideId(slide).content);
}

/**
 * Reads a Marp file and returns parsed frontmatter and slides with IDs.
 * Handles file read errors and size validation.
 */
async function readAndParseSlides(filePath: string): Promise<
  | { ok: true; frontmatter: string; slides: string[] }
  | { ok: false; response: ToolResponse }
> {
  let existingContent: string;

  try {
    existingContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    return {
      ok: false,
      response: createErrorResponse(
        `Could not read file at ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      ),
    };
  }

  if (existingContent.length > MAX_FILE_SIZE) {
    return {
      ok: false,
      response: createErrorResponse(
        `File too large (${existingContent.length} bytes, max ${MAX_FILE_SIZE} bytes)`
      ),
    };
  }

  const { frontmatter, body } = parseFrontmatter(existingContent);
  let slides = splitSlides(body);
  slides = ensureAllSlidesHaveIds(slides);

  return { ok: true, frontmatter, slides };
}

/**
 * Appends speaker notes to slide content as an HTML comment block.
 *
 * @param slideContent - The slide content
 * @param note - Optional speaker notes to append
 * @returns The slide content with appended notes if provided, otherwise unchanged
 */
function appendSlideNote(slideContent: string, note?: string): string {
  if (note === undefined || note.length === 0) {
    return slideContent;
  }

  const normalizedNote = note.replace(/\r\n/g, "\n");
  const trimmedContent = slideContent.trimEnd();
  const separator = trimmedContent.length > 0 ? "\n\n" : "";
  return `${trimmedContent}${separator}<!--\n${normalizedNote}\n-->`;
}

/**
 * MCP Tool: Manages slides in a Marp presentation file.
 * Supports inserting, replacing, and deleting slides using slide IDs.
 *
 * @param {object} options - The slide management options
 * @param {string} options.filePath - Absolute path to the Marp markdown file
 * @param {string} [options.layoutType] - Layout type to use (title, lead, content, etc.)
 * @param {Record<string, any>} [options.params] - Parameters for the layout template
 * @param {"insert" | "replace" | "delete"} [options.mode="insert"] - Operation mode
 * @param {"end" | "start" | "after" | "before"} [options.position="end"] - Position for insertion
 * @param {string} [options.slideId] - Slide ID for 'after', 'before', 'replace', or 'delete' operations
 * @param {string} [options.note] - Optional speaker notes to append
 * @returns {Promise<ToolResponse>} Operation result with slide information
 */
export async function manageSlide({
  filePath,
  layoutType,
  params,
  mode = "insert",
  position = "end",
  slideId,
  note,
  theme: themeName,
  style: styleName,
}: z.infer<typeof manageSlideSchema>): Promise<ToolResponse> {
  // Validate file path
  const pathError = validateFilePath(filePath);
  if (pathError) {
    return createErrorResponse(pathError);
  }

  // Resolve theme and style
  const resolvedTheme = themeName ? getTheme(themeName) : getActiveTheme();
  if (themeName && !resolvedTheme) {
    return createErrorResponse(`Unknown theme: "${themeName}". Call list_themes_and_styles to see available themes.`);
  }
  const resolvedStyle = styleName ? getStyle(styleName) : getActiveStyle();
  if (styleName && !resolvedStyle) {
    return createErrorResponse(`Unknown style: "${styleName}". Call list_themes_and_styles to see available styles.`);
  }
  if (
    resolvedStyle!.compatibleThemes.length > 0 &&
    !resolvedStyle!.compatibleThemes.includes(resolvedTheme!.name)
  ) {
    return createErrorResponse(
      `Style "${resolvedStyle!.name}" is not compatible with theme "${resolvedTheme!.name}". ` +
        `Compatible themes: ${resolvedStyle!.compatibleThemes.join(", ")}.`
    );
  }

  // Handle delete mode separately
  if (mode === "delete") {
    if (!slideId) {
      return createErrorResponse(
        "slideId is required for delete mode. Use read_slide to list all slides and their IDs."
      );
    }

    try {
      const result = await readAndParseSlides(filePath);
      if (!result.ok) return result.response;

      const { frontmatter, slides } = result;
      const slideIndex = findSlideIndexById(slides, slideId);

      if (slideIndex === -1) {
        return createErrorResponse(
          `Slide with ID "${slideId}" not found in ${filePath}. Call read_slide on this file to see all current slide IDs.`
        );
      }

      // Remove the slide
      slides.splice(slideIndex, 1);
      const newContent = joinSlides(frontmatter, slides);
      await fs.writeFile(filePath, newContent, "utf-8");

      return createSuccessResponse({
        operation: `Deleted slide with ID ${slideId}`,
        totalSlides: slides.length,
        file: filePath,
      });
    } catch (error) {
      return createErrorResponse(
        `Error deleting slide: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // For insert/replace modes, layoutType and params are required
  if (!layoutType) {
    return createErrorResponse("layoutType is required for insert/replace modes");
  }

  const layout = getLayout(layoutType, resolvedTheme!, resolvedStyle!);

  if (!layout) {
    return createErrorResponse(
      `Unknown layout type "${layoutType}". Available layouts: ${getLayoutNames(resolvedTheme!, resolvedStyle!).join(", ")}. ` +
        "Call list_layouts to see full parameter details for each layout."
    );
  }

  // Validate required parameters
  const missingParams: string[] = [];
  for (const [paramName, paramDef] of Object.entries(layout.params)) {
    if (paramDef.required && (!params || !params[paramName])) {
      missingParams.push(paramName);
    }
  }

  if (missingParams.length > 0) {
    return createErrorResponse(
      `Missing required parameters for layout "${layoutType}": ${missingParams.join(", ")}. ` +
        "Call list_layouts to see all required and optional parameters."
    );
  }

  // Validate parameter types and constraints
  if (params) {
    for (const [paramName, value] of Object.entries(params)) {
      const paramDef = layout.params[paramName];
      if (!paramDef) continue;

      if (paramDef.type === "string" && typeof value !== "string") {
        return createErrorResponse(`Parameter "${paramName}" must be a string`);
      }

      if (paramDef.type === "array" && !Array.isArray(value)) {
        return createErrorResponse(`Parameter "${paramName}" must be an array`);
      }

      if (paramDef.type === "number" && typeof value !== "number") {
        return createErrorResponse(`Parameter "${paramName}" must be a number`);
      }

      if (paramDef.type === "string" && paramDef.maxLength && typeof value === "string") {
        if (value.length > paramDef.maxLength) {
          return createErrorResponse(
            `Parameter "${paramName}" exceeds maximum length of ${paramDef.maxLength} characters (current: ${value.length})`
          );
        }
      }

      if (paramDef.type === "array" && paramDef.maxItems && Array.isArray(value)) {
        if (value.length > paramDef.maxItems) {
          return createErrorResponse(
            `Parameter "${paramName}" exceeds maximum items of ${paramDef.maxItems} (current: ${value.length})`
          );
        }
      }
    }
  }

  // Validate slideId for operations that require it
  if ((position === "after" || position === "before" || mode === "replace") && !slideId) {
    return createErrorResponse(
      `slideId is required for position "${position}" or mode "${mode}". ` +
        "Call read_slide to list all slides and their IDs, then pass the target slideId."
    );
  }

  // Generate slide content
  try {
    const slideContent = appendSlideNote(layout.template(params || {}), note);

    const result = await readAndParseSlides(filePath);
    if (!result.ok) return result.response;

    const { frontmatter, slides } = result;

    let newContent: string;
    let operation: string;
    let resultSlideId: string;

    if (mode === "replace") {
      if (!slideId) {
        return createErrorResponse("slideId is required for replace mode");
      }

      const slideIndex = findSlideIndexById(slides, slideId);

      if (slideIndex === -1) {
        return createErrorResponse(
          `Slide with ID "${slideId}" not found in ${filePath}. Call read_slide on this file to see all current slide IDs.`
        );
      }

      // Keep the same ID for replaced slide
      const slideWithId = `<!-- slide-id: ${slideId} -->\n\n${slideContent}`;
      slides[slideIndex] = slideWithId;
      newContent = joinSlides(frontmatter, slides);
      operation = `Replaced slide with ID ${slideId}`;
      resultSlideId = slideId;
    } else {
      // Insert mode - generate new ID
      const newSlideId = generateSlideId();
      const slideWithId = `<!-- slide-id: ${newSlideId} -->\n\n${slideContent}`;

      let insertIndex: number;

      if (position === "start") {
        insertIndex = 0;
      } else if (position === "end") {
        insertIndex = slides.length;
      } else if (position === "after") {
        if (!slideId) {
          return createErrorResponse('slideId is required for position "after"');
        }

        const refIndex = findSlideIndexById(slides, slideId);
        if (refIndex === -1) {
          return createErrorResponse(
            `Slide with ID "${slideId}" not found in ${filePath}. Call read_slide on this file to see all current slide IDs.`
          );
        }

        insertIndex = refIndex + 1;
      } else if (position === "before") {
        if (!slideId) {
          return createErrorResponse('slideId is required for position "before"');
        }

        const refIndex = findSlideIndexById(slides, slideId);
        if (refIndex === -1) {
          return createErrorResponse(
            `Slide with ID "${slideId}" not found in ${filePath}. Call read_slide on this file to see all current slide IDs.`
          );
        }

        insertIndex = refIndex;
      } else {
        insertIndex = slides.length;
      }

      slides.splice(insertIndex, 0, slideWithId);
      newContent = joinSlides(frontmatter, slides);
      operation = `Inserted slide at position ${insertIndex + 1} (${position})`;
      resultSlideId = newSlideId;
    }

    // Write updated content
    await fs.writeFile(filePath, newContent, "utf-8");

    return createSuccessResponse({
      operation,
      slideId: resultSlideId,
      layoutType,
      totalSlides: slides.length,
      file: filePath,
    });
  } catch (error) {
    return createErrorResponse(
      `Error managing slide: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
