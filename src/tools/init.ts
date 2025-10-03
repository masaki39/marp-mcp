/**
 * Tool: init_presentation
 * Initialize a Marp presentation project directory structure
 */

import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import type { ToolResponse } from "../types.js";

// Import templates as strings
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const initPresentationSchema = z.object({
  projectPath: z.string().describe("Path to the directory where presentation files will be created (current directory)"),
  presentationTitle: z.string().describe("Title of the presentation"),
  presentationSubtitle: z.string().optional().describe("Subtitle of the presentation"),
  description: z.string().optional().describe("Brief description of the presentation"),
});

export async function initPresentation({
  projectPath,
  presentationTitle,
  presentationSubtitle,
  description,
}: z.infer<typeof initPresentationSchema>): Promise<ToolResponse> {
  try {
    // Use projectPath as the presentation directory
    const fullPath = path.resolve(projectPath);

    // Create directory structure
    await fs.mkdir(fullPath, { recursive: true });
    await fs.mkdir(path.join(fullPath, "attachments"), { recursive: true });
    await fs.mkdir(path.join(fullPath, ".vscode"), { recursive: true });

    // Read template files
    const templatesDir = path.join(__dirname, "..", "templates");

    const cssTemplate = await fs.readFile(
      path.join(templatesDir, "custom_theme.css"),
      "utf-8"
    );

    let slidesTemplate = await fs.readFile(
      path.join(templatesDir, "slides.template.md"),
      "utf-8"
    );

    let readmeTemplate = await fs.readFile(
      path.join(templatesDir, "README.template.md"),
      "utf-8"
    );

    // Replace placeholders
    slidesTemplate = slidesTemplate
      .replace(/\{\{PRESENTATION_TITLE\}\}/g, presentationTitle)
      .replace(/\{\{PRESENTATION_SUBTITLE\}\}/g, presentationSubtitle || "");

    readmeTemplate = readmeTemplate
      .replace(/\{\{PRESENTATION_TITLE\}\}/g, presentationTitle)
      .replace(/\{\{PRESENTATION_DESCRIPTION\}\}/g, description || "");

    // Create VS Code settings for Marp theme
    const vscodeSettings = {
      "markdown.marp.themes": ["./custom_theme.css"]
    };

    // Write files
    await fs.writeFile(
      path.join(fullPath, ".vscode", "settings.json"),
      JSON.stringify(vscodeSettings, null, 2)
    );
    await fs.writeFile(path.join(fullPath, "custom_theme.css"), cssTemplate);
    await fs.writeFile(path.join(fullPath, "slides.md"), slidesTemplate);
    await fs.writeFile(path.join(fullPath, "README.md"), readmeTemplate);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: true,
              message: `Successfully initialized presentation project at ${fullPath}`,
              structure: {
                root: fullPath,
                files: [
                  "slides.md",
                  "README.md",
                  ".vscode/settings.json",
                  "custom_theme.css",
                ],
                directories: [
                  ".vscode/",
                  "attachments/",
                ],
              },
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
          text: `Error initializing presentation: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
