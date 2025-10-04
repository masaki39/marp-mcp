/**
 * Layout registry and list_slide_layouts tool
 */

import { z } from "zod";
import type { SlideLayout } from "../layouts/types.js";
import { sectionLayout } from "../layouts/section.js";
import { titleLayout } from "../layouts/title.js";
import { listLayout } from "../layouts/list.js";
import { tableLayout } from "../layouts/table.js";
import { twoColumnLayout } from "../layouts/two-column.js";
import { imageRightLayout } from "../layouts/image-right.js";
import { imageLayout } from "../layouts/image-center.js";

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

/**
 * All available layouts
 */
export const layouts = {
  section: sectionLayout,
  title: titleLayout,
  list: listLayout,
  table: tableLayout,
  "two-column": twoColumnLayout,
  "image-right": imageRightLayout,
  "image-center": imageLayout,
} as const;

/**
 * Get layout by name
 */
export function getLayout(name: string): SlideLayout | null {
  return (layouts[name as keyof typeof layouts] as SlideLayout) || null;
}

/**
 * Get all layout names
 */
export function getLayoutNames(): string[] {
  return Object.keys(layouts);
}

/**
 * Get all layouts info
 */
export function getAllLayoutsInfo() {
  return Object.entries(layouts).map(([name, layout]) => ({
    name,
    description: layout.description,
    className: layout.className,
    params: Object.entries(layout.params).map(([paramName, paramDef]) => ({
      name: paramName,
      ...paramDef,
    })),
  }));
}

/**
 * Tool: list_layouts
 * List all available slide layouts with their parameters
 */
export const listLayoutsSchema = z.object({});

export async function listLayouts(): Promise<ToolResponse> {
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
