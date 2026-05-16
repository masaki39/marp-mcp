/**
 * Tool: set_frontmatter
 * Ensures Marp-required frontmatter fields exist with the correct values.
 */

import { promises as fs } from "fs";
import { z } from "zod";
import matter from "gray-matter";
import { getActiveTheme, getTheme } from "../themes/index.js";
import { getActiveStyle, getStyle } from "../styles/index.js";
import { validateFilePath } from "../utils/path-validator.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

import { MAX_FILE_SIZE } from "../utils/constants.js";

type TargetKey = "marp" | "theme" | "header" | "paginate" | "style";

export const setFrontmatterSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file (must end in .md)"),
  header: z
    .string()
    .optional()
    .describe(
      "Text displayed in the slide header on every slide (e.g. presentation title or section name). " +
        'Omit to keep existing value, or pass empty string "" to show a blank header.'
    ),
  paginate: z
    .boolean()
    .optional()
    .describe(
      "Show slide page numbers (true/false). Omit to keep existing value; defaults to false on first call."
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
 * Sets or updates Marp frontmatter fields in a markdown file.
 *
 * @param {object} options - The frontmatter options
 * @param {string} options.filePath - Absolute path to the Marp markdown file
 * @param {string} [options.header] - Optional header text
 * @param {boolean} [options.paginate] - Optional paginate flag
 * @returns {Promise<ToolResponse>} Operation result
 */
export async function setFrontmatter({
  filePath,
  header,
  paginate,
  theme: themeName,
  style: styleName,
}: z.infer<typeof setFrontmatterSchema>): Promise<ToolResponse> {
  // Validate file path
  const pathError = validateFilePath(filePath);
  if (pathError) {
    return createErrorResponse(pathError);
  }

  let existingContent: string;
  try {
    existingContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    return createErrorResponse(
      `Could not read file at ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Check file size
  if (existingContent.length > MAX_FILE_SIZE) {
    return createErrorResponse(
      `File too large (${existingContent.length} bytes, max ${MAX_FILE_SIZE} bytes)`
    );
  }

  // Parse existing frontmatter
  let parsed;
  try {
    parsed = matter(existingContent);
  } catch (error) {
    return createErrorResponse(
      `Invalid YAML frontmatter: ${error instanceof Error ? error.message : String(error)}`
    );
  }
  const data = parsed.data as Record<string, any>;

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

  const activeTheme = resolvedTheme!.name;
  const activeStyleDef = resolvedStyle!;

  // Determine header value
  const headerValue = header !== undefined
    ? header
    : (data.header !== undefined ? String(data.header) : "");

  // Determine paginate value
  const paginateValue = paginate !== undefined
    ? paginate
    : (data.paginate !== undefined ? Boolean(data.paginate) : false);

  // Update frontmatter data
  const newData: Record<string, any> = {
    ...data,
    marp: true,
    theme: activeTheme,
    header: headerValue,
    paginate: paginateValue,
  };

  // Inject style CSS if active style has CSS
  if (activeStyleDef.css) {
    newData.style = activeStyleDef.css;
  }

  // Stringify with gray-matter
  const updatedContent = matter.stringify(parsed.content, newData);

  // Check if content actually changed
  if (updatedContent === existingContent) {
    return createSuccessResponse({
      message: "Frontmatter already satisfied requirements",
      file: filePath,
      style: activeStyleDef.name,
      frontmatter: {
        marp: true,
        theme: activeTheme,
        header: headerValue,
        paginate: paginateValue,
      },
    });
  }

  // Write updated content
  await fs.writeFile(filePath, updatedContent, "utf-8");

  return createSuccessResponse({
    message: "Updated frontmatter successfully",
    file: filePath,
    style: activeStyleDef.name,
    frontmatter: {
      marp: true,
      theme: activeTheme,
      header: headerValue,
      paginate: paginateValue,
    },
  });
}
