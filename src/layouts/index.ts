/**
 * Layout registry and utilities
 */

import type { SlideLayout } from "./types.js";
import { sectionLayout } from "./section.js";
import { titleLayout } from "./title.js";
import { contentLayout } from "./content.js";
import { tableLayout } from "./table.js";
import { multiColumnLayout } from "./multi-column.js";
import { figureLayout } from "./figure.js";
import { imageLayout } from "./image.js";

/**
 * All available layouts
 */
export const layouts = {
  section: sectionLayout,
  title: titleLayout,
  content: contentLayout,
  table: tableLayout,
  "multi-column": multiColumnLayout,
  figure: figureLayout,
  image: imageLayout,
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

// Re-export types
export type { SlideLayout } from "./types.js";
