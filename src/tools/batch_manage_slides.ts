/**
 * Tool: batch_manage_slides
 * Apply multiple slide operations to a Marp file in a single file read/write cycle.
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { getLayout, getLayoutNames } from "./list_layouts.js";
import { getActiveTheme, getTheme } from "../themes/index.js";
import { getActiveStyle, getStyle } from "../styles/index.js";
import {
  ensureAllSlideIds,
  findSlideIndexById,
  generateSlideId,
} from "../utils/slide-id.js";
import { validateFilePath } from "../utils/path-validator.js";
import { parseFrontmatter, splitSlides, joinSlides } from "../utils/frontmatter.js";
import { MAX_FILE_SIZE } from "../utils/constants.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

const slideOperationSchema = z.object({
  layoutType: z
    .string()
    .optional()
    .describe(
      "Layout type to use. Required for insert/replace. Not required for delete/move."
    ),
  params: z.record(z.any()).optional().describe("Parameters for the layout template."),
  mode: z
    .enum(["insert", "replace", "delete", "move"])
    .optional()
    .describe("Operation mode: 'insert' (default), 'replace', 'delete', or 'move'."),
  position: z
    .enum(["end", "start", "after", "before"])
    .optional()
    .describe("Insertion position (insert mode only). Default: 'end'."),
  slideId: z
    .string()
    .optional()
    .describe("Target slide ID. Required for replace, delete, move, or position after/before."),
  note: z.string().optional().describe("Speaker notes appended as an HTML comment."),
  targetPosition: z
    .enum(["end", "start", "after", "before"])
    .optional()
    .describe("Move destination (move mode only). Default: 'end'."),
  targetSlideId: z
    .string()
    .optional()
    .describe(
      "Reference slide ID for targetPosition 'after' or 'before' (move mode only)."
    ),
});

export const batchManageSlidesSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file (must end in .md)"),
  operations: z
    .array(slideOperationSchema)
    .min(1)
    .describe(
      "List of slide operations to apply in order. Each operation is equivalent to one manage_slide call. " +
        "Operations are applied sequentially to the same in-memory slide array and written in a single file write."
    ),
  theme: z
    .string()
    .optional()
    .describe(
      "Theme name applied to all operations (e.g. 'gaia'). Overrides server default for this call."
    ),
  style: z
    .string()
    .optional()
    .describe(
      "Style name applied to all operations (e.g. 'rich'). Overrides server default for this call."
    ),
});

function appendNote(slideContent: string, note?: string): string {
  if (!note || note.length === 0) return slideContent;
  const normalized = note.replace(/\r\n/g, "\n");
  const trimmed = slideContent.trimEnd();
  const sep = trimmed.length > 0 ? "\n\n" : "";
  return `${trimmed}${sep}<!--\n${normalized}\n-->`;
}

export async function batchManageSlides({
  filePath,
  operations,
  theme: themeName,
  style: styleName,
}: z.infer<typeof batchManageSlidesSchema>): Promise<ToolResponse> {
  const pathError = validateFilePath(filePath);
  if (pathError) return createErrorResponse(pathError);

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

  let existingContent: string;
  try {
    existingContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    return createErrorResponse(
      `Could not read file at ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  if (existingContent.length > MAX_FILE_SIZE) {
    return createErrorResponse(
      `File too large (${existingContent.length} bytes, max ${MAX_FILE_SIZE} bytes)`
    );
  }

  const { frontmatter, body } = parseFrontmatter(existingContent);
  const slides = ensureAllSlideIds(splitSlides(body)).slides;

  const results: Array<Record<string, unknown>> = [];

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const mode = op.mode ?? "insert";
    const position = op.position ?? "end";
    const targetPosition = op.targetPosition ?? "end";

    if (mode === "delete") {
      if (!op.slideId) {
        return createErrorResponse(`Operation ${i + 1}: slideId is required for delete mode.`);
      }
      const idx = findSlideIndexById(slides, op.slideId);
      if (idx === -1) {
        return createErrorResponse(`Operation ${i + 1}: Slide with ID "${op.slideId}" not found.`);
      }
      slides.splice(idx, 1);
      results.push({ op: i + 1, mode: "delete", slideId: op.slideId, totalSlides: slides.length });
      continue;
    }

    if (mode === "move") {
      if (!op.slideId) {
        return createErrorResponse(`Operation ${i + 1}: slideId is required for move mode.`);
      }
      const idx = findSlideIndexById(slides, op.slideId);
      if (idx === -1) {
        return createErrorResponse(`Operation ${i + 1}: Slide with ID "${op.slideId}" not found.`);
      }
      const [movedSlide] = slides.splice(idx, 1);

      let insertIndex: number;
      if (targetPosition === "start") {
        insertIndex = 0;
      } else if (targetPosition === "after") {
        if (!op.targetSlideId) {
          return createErrorResponse(`Operation ${i + 1}: targetSlideId required for targetPosition "after".`);
        }
        const ref = findSlideIndexById(slides, op.targetSlideId);
        if (ref === -1) {
          return createErrorResponse(`Operation ${i + 1}: Target slide "${op.targetSlideId}" not found.`);
        }
        insertIndex = ref + 1;
      } else if (targetPosition === "before") {
        if (!op.targetSlideId) {
          return createErrorResponse(`Operation ${i + 1}: targetSlideId required for targetPosition "before".`);
        }
        const ref = findSlideIndexById(slides, op.targetSlideId);
        if (ref === -1) {
          return createErrorResponse(`Operation ${i + 1}: Target slide "${op.targetSlideId}" not found.`);
        }
        insertIndex = ref;
      } else {
        insertIndex = slides.length;
      }

      slides.splice(insertIndex, 0, movedSlide);
      results.push({ op: i + 1, mode: "move", slideId: op.slideId, movedToIndex: insertIndex + 1, totalSlides: slides.length });
      continue;
    }

    // insert / replace
    if (!op.layoutType) {
      return createErrorResponse(`Operation ${i + 1}: layoutType is required for ${mode} mode.`);
    }

    const layout = getLayout(op.layoutType, resolvedTheme!, resolvedStyle!);
    if (!layout) {
      return createErrorResponse(
        `Operation ${i + 1}: Unknown layout "${op.layoutType}". Available: ${getLayoutNames(resolvedTheme!, resolvedStyle!).join(", ")}.`
      );
    }

    // Validate required params
    for (const [paramName, paramDef] of Object.entries(layout.params)) {
      if (paramDef.required && (!op.params || op.params[paramName] === undefined)) {
        return createErrorResponse(
          `Operation ${i + 1}: Required parameter "${paramName}" is missing for layout "${op.layoutType}".`
        );
      }
    }

    // Validate param types and lengths
    if (op.params) {
      for (const [paramName, value] of Object.entries(op.params)) {
        const paramDef = layout.params[paramName];
        if (!paramDef) continue;

        if (paramDef.type === "string" && typeof value !== "string") {
          return createErrorResponse(`Operation ${i + 1}: Parameter "${paramName}" must be a string.`);
        }
        if (paramDef.type === "array" && !Array.isArray(value)) {
          return createErrorResponse(`Operation ${i + 1}: Parameter "${paramName}" must be an array.`);
        }
        if (paramDef.type === "number" && typeof value !== "number") {
          return createErrorResponse(`Operation ${i + 1}: Parameter "${paramName}" must be a number.`);
        }
        if (paramDef.type === "string" && paramDef.maxLength && typeof value === "string") {
          if (value.length > paramDef.maxLength) {
            return createErrorResponse(
              `Operation ${i + 1}: Parameter "${paramName}" exceeds max length ${paramDef.maxLength} (current: ${value.length}).`
            );
          }
        }
        if (paramDef.type === "array" && paramDef.maxItems && Array.isArray(value)) {
          if (value.length > paramDef.maxItems) {
            return createErrorResponse(
              `Operation ${i + 1}: Parameter "${paramName}" exceeds max items ${paramDef.maxItems} (current: ${value.length}).`
            );
          }
        }
      }
    }

    const slideContent = appendNote(layout.template(op.params ?? {}), op.note);

    if (mode === "replace") {
      if (!op.slideId) {
        return createErrorResponse(`Operation ${i + 1}: slideId is required for replace mode.`);
      }
      const idx = findSlideIndexById(slides, op.slideId);
      if (idx === -1) {
        return createErrorResponse(`Operation ${i + 1}: Slide with ID "${op.slideId}" not found.`);
      }
      slides[idx] = `<!-- slide-id: ${op.slideId} -->\n\n${slideContent}`;
      results.push({ op: i + 1, mode: "replace", slideId: op.slideId, layoutType: op.layoutType, totalSlides: slides.length });
    } else {
      // insert
      const newSlideId = generateSlideId();
      const slideWithId = `<!-- slide-id: ${newSlideId} -->\n\n${slideContent}`;

      let insertIndex: number;
      if (position === "start") {
        insertIndex = 0;
      } else if (position === "after") {
        if (!op.slideId) {
          return createErrorResponse(`Operation ${i + 1}: slideId required for position "after".`);
        }
        const ref = findSlideIndexById(slides, op.slideId);
        if (ref === -1) {
          return createErrorResponse(`Operation ${i + 1}: Reference slide "${op.slideId}" not found.`);
        }
        insertIndex = ref + 1;
      } else if (position === "before") {
        if (!op.slideId) {
          return createErrorResponse(`Operation ${i + 1}: slideId required for position "before".`);
        }
        const ref = findSlideIndexById(slides, op.slideId);
        if (ref === -1) {
          return createErrorResponse(`Operation ${i + 1}: Reference slide "${op.slideId}" not found.`);
        }
        insertIndex = ref;
      } else {
        insertIndex = slides.length;
      }

      slides.splice(insertIndex, 0, slideWithId);
      results.push({ op: i + 1, mode: "insert", slideId: newSlideId, layoutType: op.layoutType, insertedAt: insertIndex + 1, totalSlides: slides.length });
    }
  }

  try {
    const newContent = joinSlides(frontmatter, slides);
    await fs.writeFile(filePath, newContent, "utf-8");
  } catch (error) {
    return createErrorResponse(
      `Error writing file: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  return createSuccessResponse({
    message: `${operations.length} operation(s) applied successfully.`,
    file: filePath,
    totalSlides: slides.length,
    results,
  });
}
