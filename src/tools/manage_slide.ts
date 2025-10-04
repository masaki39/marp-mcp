/**
 * Tool: manage_slide
 * Manage slides in a Marp presentation file (insert, replace, delete)
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { getLayout, getLayoutNames } from "./list_layouts.js";

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
  slideNumber: z.number().optional().describe("Slide number for 'after', 'before' position, 'replace' mode, or 'delete' mode (1-indexed, excluding frontmatter)"),
});

/**
 * Ensures the file has valid frontmatter, adding minimal frontmatter if missing
 */
function ensureFrontmatter(content: string): string {
  const lines = content.split('\n');
  if (lines.length === 0 || lines[0].trim() !== '---') {
    // No frontmatter, add minimal one
    return `---\nmarp: true\n---\n\n${content}`;
  }
  return content;
}

/**
 * Joins slides back together, trimming all slides and filtering empty ones
 */
function joinSlides(slides: string[]): string {
  if (slides.length === 0) return '';

  // Trim all slides and filter out empty ones (except frontmatter at index 0)
  const processedSlides = slides
    .map((s, i) => {
      const trimmed = s.trim();
      // Keep frontmatter (index 0) even if empty, but filter out other empty slides
      if (i === 0) return trimmed;
      return trimmed || null;
    })
    .filter((s, i) => s !== null && s !== '' || i === 0) as string[];

  return processedSlides.join('\n\n---\n\n');
}

export async function manageSlide({
  filePath,
  layoutType,
  params,
  mode = "insert",
  position = "end",
  slideNumber,
}: z.infer<typeof manageSlideSchema>): Promise<ToolResponse> {
  // Handle delete mode separately
  if (mode === "delete") {
    if (!slideNumber) {
      return {
        content: [
          {
            type: "text",
            text: `Error: slideNumber is required for delete mode`,
          },
        ],
      };
    }

    if (slideNumber < 1) {
      return {
        content: [
          {
            type: "text",
            text: `Error: Invalid slideNumber ${slideNumber}. Slide numbers start from 1 (frontmatter is not counted)`,
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

      // Ensure frontmatter exists
      existingContent = ensureFrontmatter(existingContent);

      const slides = existingContent.split(/\n---\n/);
      const actualSlideCount = slides.length - 1; // Exclude frontmatter

      if (slideNumber > actualSlideCount) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Invalid slideNumber ${slideNumber}. Must be between 1 and ${actualSlideCount}`,
            },
          ],
        };
      }

      // Convert slideNumber to array index (slideNumber 1 = index 1)
      slides.splice(slideNumber, 1);
      const newContent = joinSlides(slides);
      await fs.writeFile(filePath, newContent, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                operation: `Deleted slide ${slideNumber}`,
                totalSlides: slides.length - 1, // Exclude frontmatter from count
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

  // Validate slideNumber for operations that require it
  if ((position === "after" || position === "before" || mode === "replace") && !slideNumber) {
    return {
      content: [
        {
          type: "text",
          text: `Error: slideNumber is required for position "${position}" or mode "${mode}"`,
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

    // Ensure frontmatter exists
    existingContent = ensureFrontmatter(existingContent);

    // Split slides by separator
    const slides = existingContent.split(/\n---\n/);
    const actualSlideCount = slides.length - 1; // Exclude frontmatter

    let newContent: string;
    let operation: string;

    if (mode === "replace") {
      if (!slideNumber || slideNumber < 1 || slideNumber > actualSlideCount) {
        return {
          content: [
            {
              type: "text",
              text: `Error: Invalid slideNumber ${slideNumber}. Must be between 1 and ${actualSlideCount}`,
            },
          ],
        };
      }

      // Convert slideNumber to array index (slideNumber 1 = index 1)
      slides[slideNumber] = slideContent;
      newContent = joinSlides(slides);
      operation = `Replaced slide ${slideNumber}`;
    } else {
      // Insert mode
      let insertIndex: number;

      if (position === "start") {
        insertIndex = 1; // After frontmatter
      } else if (position === "end") {
        insertIndex = slides.length;
      } else if (position === "after") {
        if (!slideNumber || slideNumber < 1 || slideNumber > actualSlideCount) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Invalid slideNumber ${slideNumber}. Must be between 1 and ${actualSlideCount}`,
              },
            ],
          };
        }
        // Insert after slideNumber (slideNumber 1 = index 1, so insert at index 2)
        insertIndex = slideNumber + 1;
      } else if (position === "before") {
        if (!slideNumber || slideNumber < 1 || slideNumber > actualSlideCount) {
          return {
            content: [
              {
                type: "text",
                text: `Error: Invalid slideNumber ${slideNumber}. Must be between 1 and ${actualSlideCount}`,
              },
            ],
          };
        }
        // Insert before slideNumber (slideNumber 1 = index 1, so insert at index 1)
        insertIndex = slideNumber;
      } else {
        insertIndex = slides.length;
      }

      slides.splice(insertIndex, 0, slideContent);
      newContent = joinSlides(slides);
      operation = `Inserted slide at position ${insertIndex} (${position})`;
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
              layoutType,
              totalSlides: slides.length - 1, // Exclude frontmatter from count
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
