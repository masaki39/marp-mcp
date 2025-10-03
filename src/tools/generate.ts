/**
 * Tool: generate_slide
 * Generate a slide using academic theme layouts
 */

import { z } from "zod";
import type { ToolResponse } from "../types.js";
import { getLayout, getLayoutNames } from "../layouts/academic.js";

export const generateSlideSchema = z.object({
  layoutType: z.string().describe("Layout type to use (title, lead, content, table, multi-column, quote)"),
  params: z.record(z.any()).describe("Parameters for the layout template"),
});

export async function generateSlide({
  layoutType,
  params,
}: z.infer<typeof generateSlideSchema>): Promise<ToolResponse> {
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
    if (paramDef.required && !params[paramName]) {
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
  for (const [paramName, value] of Object.entries(params)) {
    const paramDef = layout.params[paramName];
    if (!paramDef) continue;

    // Check type for string parameters
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

    // Check type for array parameters
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

    // Check max length for string parameters
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

  // Generate slide content
  try {
    const slideContent = layout.template(params);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: true,
              layoutType,
              markdown: slideContent,
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
          text: `Error generating slide: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}

/**
 * Tool: list_slide_layouts
 * List all available slide layouts with their parameters
 */
export const listSlideLayoutsSchema = z.object({});

export async function listSlideLayouts(): Promise<ToolResponse> {
  const { getAllLayoutsInfo } = await import("../layouts/academic.js");
  const layoutsInfo = getAllLayoutsInfo();

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            theme: "academic",
            layouts: layoutsInfo,
          },
          null,
          2
        ),
      },
    ],
  };
}
