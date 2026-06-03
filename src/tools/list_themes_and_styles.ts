/**
 * Tool: list_themes_and_styles
 * Lists all available themes and styles with their descriptions and layout counts.
 * Helps LLMs choose appropriate visual styles for presentations.
 */

import { z } from "zod";
import { getAvailableThemeNames, getTheme, getActiveTheme } from "../themes/index.js";
import {
  getAvailableStyleNames,
  getStyle,
  getActiveStyle,
  getExternalStyles,
} from "../styles/index.js";
import type { ToolResponse } from "../types/common.js";

export const listThemesAndStylesSchema = z.object({});

/**
 * MCP Tool: Lists all available themes and styles with descriptions.
 *
 * @returns {Promise<ToolResponse>} Theme and style information
 */
export async function listThemesAndStyles(): Promise<ToolResponse> {
  const themeNames = getAvailableThemeNames();
  const styleNames = getAvailableStyleNames();

  const themes = themeNames.map((name) => {
    const theme = getTheme(name)!;
    return {
      name: theme.name,
      description: theme.description,
      layoutCount: Object.keys(theme.layouts).length,
      layouts: Object.keys(theme.layouts),
    };
  });

  const externalNames = new Set(
    getExternalStyles().map((entry) => entry.def.name)
  );

  const styles = styleNames
    .filter((name) => name !== "default" && !externalNames.has(name))
    .map((name) => {
      const style = getStyle(name)!;
      return {
        name: style.name,
        description: style.description,
        compatibleThemes:
          style.compatibleThemes.length > 0
            ? style.compatibleThemes
            : ["all themes"],
        layoutCount: Object.keys(style.layouts).length,
        layouts: Object.keys(style.layouts),
      };
    });

  const externalStyles = getExternalStyles().map(({ def, source }) => ({
    name: def.name,
    description: def.description,
    compatibleThemes:
      def.compatibleThemes.length > 0 ? def.compatibleThemes : ["all themes"],
    layoutCount: Object.keys(def.layouts).length,
    layouts: Object.keys(def.layouts),
    source,
    external: true as const,
  }));

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            currentDefaults: {
              theme: getActiveTheme().name,
              style: getActiveStyle().name,
            },
            usage: {
              serverDefaults:
                "Set server defaults via -t / -s CLI flags at startup (e.g. marp-mcp -t gaia -s rich). Omitting flags defaults to 'default'.",
              perCall:
                "Override per call by passing 'theme' and/or 'style' params to list_layouts, manage_slide, or set_frontmatter. Omit to use server defaults.",
              combining:
                "Styles add layouts on top of themes. Use list_layouts to see the merged layout list for a specific theme+style combination.",
            },
            themes,
            styles: [...styles, ...externalStyles],
          },
          null,
          2
        ),
      },
    ],
  };
}
