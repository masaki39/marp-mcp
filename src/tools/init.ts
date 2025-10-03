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
  projectPath: z.string().describe("Path where the project directory will be created"),
  projectName: z.string().describe("Name of the presentation project"),
  presentationTitle: z.string().describe("Title of the presentation"),
  presentationSubtitle: z.string().optional().describe("Subtitle of the presentation"),
  description: z.string().optional().describe("Brief description of the presentation"),
});

export async function initPresentation({
  projectPath,
  projectName,
  presentationTitle,
  presentationSubtitle,
  description,
}: z.infer<typeof initPresentationSchema>): Promise<ToolResponse> {
  try {
    // Create project directory
    const fullPath = path.resolve(projectPath, projectName);

    // Check if directory already exists
    try {
      await fs.access(fullPath);
      return {
        content: [
          {
            type: "text",
            text: `Error: Directory already exists at ${fullPath}`,
          },
        ],
      };
    } catch {
      // Directory doesn't exist, proceed
    }

    // Create directory structure
    await fs.mkdir(fullPath, { recursive: true });
    await fs.mkdir(path.join(fullPath, "themes"), { recursive: true });
    await fs.mkdir(path.join(fullPath, "attachments", "images"), { recursive: true });
    await fs.mkdir(path.join(fullPath, "attachments", "videos"), { recursive: true });
    await fs.mkdir(path.join(fullPath, "attachments", "data"), { recursive: true });

    // Read template files
    const templatesDir = path.join(__dirname, "..", "templates");

    const cssTemplate = await fs.readFile(
      path.join(templatesDir, "academic_custom.css"),
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

    const gitignoreTemplate = await fs.readFile(
      path.join(templatesDir, "gitignore.template"),
      "utf-8"
    );

    // Replace placeholders
    slidesTemplate = slidesTemplate
      .replace(/\{\{PRESENTATION_TITLE\}\}/g, presentationTitle)
      .replace(/\{\{PRESENTATION_SUBTITLE\}\}/g, presentationSubtitle || "");

    readmeTemplate = readmeTemplate
      .replace(/\{\{PRESENTATION_TITLE\}\}/g, presentationTitle)
      .replace(/\{\{PRESENTATION_DESCRIPTION\}\}/g, description || "");

    // Write files
    await fs.writeFile(path.join(fullPath, "themes", "academic_custom.css"), cssTemplate);
    await fs.writeFile(path.join(fullPath, "slides.md"), slidesTemplate);
    await fs.writeFile(path.join(fullPath, "README.md"), readmeTemplate);
    await fs.writeFile(path.join(fullPath, ".gitignore"), gitignoreTemplate);

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
                  ".gitignore",
                  "themes/academic_custom.css",
                ],
                directories: [
                  "themes/",
                  "attachments/images/",
                  "attachments/videos/",
                  "attachments/data/",
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
