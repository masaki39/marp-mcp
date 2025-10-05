/**
 * Tool: manage_slide
 * Manage slides in a Marp presentation file (insert, replace, delete) using slide IDs
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { getLayout, getLayoutNames } from "./list_layouts.js";
import { ensureSlideId, findSlideIndexById, generateSlideId } from "../utils/slide-id.js";

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export const manageSlideSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file"),
  layoutType: z.string().optional().describe("Layout type to use (title, lead, content, table, multi-column, quote). Not required for delete mode."),
  params: z.record(z.any()).optional().describe("Parameters for the layout template. Not required for delete mode."),
  mode: z.enum(["insert", "replace", "delete"]).optional().describe("Operation mode: insert (default), replace, or delete"),
  position: z.enum(["end", "start", "after", "before"]).optional().describe("Position for insertion: end (default), start, after, before"),
  slideId: z.string().optional().describe("Slide ID for 'after', 'before' position, 'replace' mode, or 'delete' mode"),
});

/**
 * Parses frontmatter from content, separating it from the body
 * If no frontmatter exists, returns default frontmatter
 */
function parseFrontmatter(content: string): { frontmatter: string; body: string } {
  const lines = content.split('\n');

  // No frontmatter case
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return {
      frontmatter: '---\nmarp: true\n---',
      body: content.trim()
    };
  }

  // Find closing ---
  const endIndex = lines.slice(1).findIndex(line => line.trim() === '---');
  if (endIndex === -1) {
    // No closing ---, treat entire content as body
    return {
      frontmatter: '---\nmarp: true\n---',
      body: content.trim()
    };
  }

  const frontmatterLines = lines.slice(0, endIndex + 2); // From opening --- to closing ---
  const bodyLines = lines.slice(endIndex + 2);

  return {
    frontmatter: frontmatterLines.join('\n'),
    body: bodyLines.join('\n').trim()
  };
}

/**
 * Joins frontmatter and slides together
 */
function joinSlides(frontmatter: string, slides: string[]): string {
  if (slides.length === 0) {
    return frontmatter;
  }

  // Trim all slides and filter out empty ones
  const processedSlides = slides
    .map(s => s.trim())
    .filter(s => s !== '');

  if (processedSlides.length === 0) {
    return frontmatter;
  }

  // Frontmatter + 2 newlines + slides joined by separator
  return frontmatter + '\n\n' + processedSlides.join('\n\n---\n\n');
}

/**
 * Ensures all slides in the array have IDs
 */
function ensureAllSlidesHaveIds(slides: string[]): string[] {
  return slides.map(slide => ensureSlideId(slide).content);
}

export async function manageSlide({
  filePath,
  layoutType,
  params,
  mode = "insert",
  position = "end",
  slideId,
}: z.infer<typeof manageSlideSchema>): Promise<ToolResponse> {
  // Handle delete mode separately
  if (mode === "delete") {
    if (!slideId) {
      return {
        content: [
          {
            type: "text",
            text: `Error: slideId is required for delete mode`,
          },
        ],
      };
    }

    try {
      let existingContent: string;

      try {
        existingContent = await fs.readFile(filePath, "utf-8");
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Could not read file at ${filePath}`,
            },
          ],
        };
      }

      // Parse frontmatter and body
      const { frontmatter, body } = parseFrontmatter(existingContent);

      let slides = body ? body.split(/\n---\n/) : [];

      // Ensure all slides have IDs
      slides = ensureAllSlidesHaveIds(slides);

      const slideIndex = findSlideIndexById(slides, slideId);

      if (slideIndex === -1) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Slide with ID "${slideId}" not found`,
            },
          ],
        };
      }

      // Remove the slide
      slides.splice(slideIndex, 1);
      const newContent = joinSlides(frontmatter, slides);
      await fs.writeFile(filePath, newContent, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                operation: `Deleted slide with ID ${slideId}`,
                totalSlides: slides.length,
                file: filePath,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error deleting slide: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  // For insert/replace modes, layoutType and params are required
  if (!layoutType) {
    return {
      content: [
        {
          type: "text",
          text: `Error: layoutType is required for insert/replace modes`,
        },
      ],
    };
  }

  const layout = getLayout(layoutType);

  if (!layout) {
    return {
      content: [
        {
          type: "text",
          text: `Error: Unknown layout type "${layoutType}". Available layouts: ${getLayoutNames().join(", ")}`,
        },
      ],
    };
  }

  // Validate required parameters
  const missingParams: string[] = [];
  for (const [paramName, paramDef] of Object.entries(layout.params)) {
    if (paramDef.required && (!params || !params[paramName])) {
      missingParams.push(paramName);
    }
  }

  if (missingParams.length > 0) {
    return {
      content: [
        {
          type: "text",
          text: `Error: Missing required parameters: ${missingParams.join(", ")}`,
        },
      ],
    };
  }

  // Validate parameter types and lengths
  if (params) {
    for (const [paramName, value] of Object.entries(params)) {
      const paramDef = layout.params[paramName];
      if (!paramDef) continue;

      if (paramDef.type === "string" && typeof value !== "string") {
        return {
          content: [
            {
              type: "text",
              text: `Error: Parameter "${paramName}" must be a string`,
            },
          ],
        };
      }

      if (paramDef.type === "array" && !Array.isArray(value)) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Parameter "${paramName}" must be an array`,
            },
          ],
        };
      }

      if (paramDef.type === "string" && paramDef.maxLength && typeof value === "string") {
        if (value.length > paramDef.maxLength) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Parameter "${paramName}" exceeds maximum length of ${paramDef.maxLength} characters (current: ${value.length})`,
              },
            ],
          };
        }
      }
    }
  }

  // Validate slideId for operations that require it
  if ((position === "after" || position === "before" || mode === "replace") && !slideId) {
    return {
      content: [
        {
          type: "text",
          text: `Error: slideId is required for position "${position}" or mode "${mode}"`,
        },
      ],
    };
  }

  // Generate slide content
  try {
    const slideContent = layout.template(params);

    // Read existing file
    let existingContent: string;
    try {
      existingContent = await fs.readFile(filePath, "utf-8");
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Could not read file at ${filePath}`,
          },
        ],
      };
    }

    // Parse frontmatter and body
    const { frontmatter, body } = parseFrontmatter(existingContent);

    let slides = body ? body.split(/\n---\n/) : [];

    // Ensure all slides have IDs
    slides = ensureAllSlidesHaveIds(slides);

    let newContent: string;
    let operation: string;
    let resultSlideId: string;

    if (mode === "replace") {
      if (!slideId) {
        return {
          content: [
            {
              type: "text",
              text: `Error: slideId is required for replace mode`,
            },
          ],
        };
      }

      const slideIndex = findSlideIndexById(slides, slideId);

      if (slideIndex === -1) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Slide with ID "${slideId}" not found`,
            },
          ],
        };
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
          return {
            content: [
              {
                type: "text",
                text: `Error: slideId is required for position "after"`,
              },
            ],
          };
        }

        const refIndex = findSlideIndexById(slides, slideId);
        if (refIndex === -1) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Slide with ID "${slideId}" not found`,
              },
            ],
          };
        }

        insertIndex = refIndex + 1;
      } else if (position === "before") {
        if (!slideId) {
          return {
            content: [
              {
                type: "text",
                text: `Error: slideId is required for position "before"`,
              },
            ],
          };
        }

        const refIndex = findSlideIndexById(slides, slideId);
        if (refIndex === -1) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Slide with ID "${slideId}" not found`,
              },
            ],
          };
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

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: true,
              operation,
              slideId: resultSlideId,
              layoutType,
              totalSlides: slides.length,
              file: filePath,
            },
            null,
            2
          ),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error managing slide: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
