/**
 * Layout registry and list_slide_layouts tool
 */

import { z } from "zod";
import { getActiveTheme, getTheme } from "../themes/index.js";
import { getActiveStyle, getStyle } from "../styles/index.js";
import type { SlideLayout, ThemeDefinition, StyleDefinition } from "../themes/types.js";
import type { ToolResponse } from "../types/common.js";
import { createErrorResponse } from "../utils/response.js";

/**
 * Returns merged layouts from the given theme and style (or active ones if omitted).
 * Style layouts override theme layouts with the same name.
 */
function getMergedLayouts(
  theme?: ThemeDefinition,
  style?: StyleDefinition
): Record<string, SlideLayout> {
  const t = theme ?? getActiveTheme();
  const s = style ?? getActiveStyle();
  return { ...t.layouts, ...s.layouts };
}

/**
 * Retrieves a slide layout by name from the merged theme+style layouts.
 *
 * @param name - The name of the layout to retrieve
 * @param theme - Optional theme override (defaults to active theme)
 * @param style - Optional style override (defaults to active style)
 * @returns The slide layout if found, null otherwise
 */
export function getLayout(
  name: string,
  theme?: ThemeDefinition,
  style?: StyleDefinition
): SlideLayout | null {
  const layouts = getMergedLayouts(theme, style);
  return layouts[name] ?? null;
}

/**
 * Retrieves all available layout names from the merged theme+style layouts.
 *
 * @param theme - Optional theme override (defaults to active theme)
 * @param style - Optional style override (defaults to active style)
 * @returns Array of layout names
 */
export function getLayoutNames(
  theme?: ThemeDefinition,
  style?: StyleDefinition
): string[] {
  const layouts = getMergedLayouts(theme, style);
  return Object.keys(layouts);
}

/**
 * Retrieves detailed information about all layouts from the merged theme+style layouts.
 *
 * @param theme - Optional theme override (defaults to active theme)
 * @param style - Optional style override (defaults to active style)
 * @returns Array of layout information including name, description, and parameters
 */
export function getAllLayoutsInfo(
  theme?: ThemeDefinition,
  style?: StyleDefinition
) {
  const layouts = getMergedLayouts(theme, style);

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

export const listLayoutsSchema = z.object({
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
 * MCP Tool: Lists all available slide layouts with their parameters.
 * This tool provides information about available layouts in the active theme,
 * including their names, descriptions, and required parameters.
 *
 * @returns {Promise<ToolResponse>} Layout information for the active theme
 */
export async function listLayouts({
  theme: themeName,
  style: styleName,
}: z.infer<typeof listLayoutsSchema>): Promise<ToolResponse> {
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

  const layoutsInfo = getAllLayoutsInfo(resolvedTheme!, resolvedStyle!);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            theme: resolvedTheme!.name,
            style: resolvedStyle!.name,
            layouts: layoutsInfo,
          },
          null,
          2
        ),
      },
    ],
  };
}
