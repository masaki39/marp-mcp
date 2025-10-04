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

      // Parse frontmatter and body
      const { frontmatter, body } = parseFrontmatter(existingContent);

      const slides = body ? body.split(/\n---\n/) : [];
      const actualSlideCount = slides.length;

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

      // Convert slideNumber to array index (slideNumber 1 = index 0)
      slides.splice(slideNumber - 1, 1);
      const newContent = joinSlides(frontmatter, slides);
      await fs.writeFile(filePath, newContent, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                operation: `Deleted slide ${slideNumber}`,
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

    // Parse frontmatter and body
    const { frontmatter, body } = parseFrontmatter(existingContent);

    const slides = body ? body.split(/\n---\n/) : [];
    const actualSlideCount = slides.length;

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

      // Convert slideNumber to array index (slideNumber 1 = index 0)
      slides[slideNumber - 1] = slideContent;
      newContent = joinSlides(frontmatter, slides);
      operation = `Replaced slide ${slideNumber}`;
    } else {
      // Insert mode
      let insertIndex: number;

      if (position === "start") {
        insertIndex = 0;
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
        // Insert after slideNumber (slideNumber 1 = index 0, so insert at index 1)
        insertIndex = slideNumber;
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
        // Insert before slideNumber (slideNumber 1 = index 0, so insert at index 0)
        insertIndex = slideNumber - 1;
      } else {
        insertIndex = slides.length;
      }

      slides.splice(insertIndex, 0, slideContent);
      newContent = joinSlides(frontmatter, slides);
      operation = `Inserted slide at position ${insertIndex + 1} (${position})`;
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
