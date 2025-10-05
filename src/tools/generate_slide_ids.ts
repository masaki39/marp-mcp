/**
 * Tool: generate_slide_ids
 * Automatically generates and assigns unique IDs to all slides in a Marp file
 */

import { z } from "zod";
import { promises as fs } from "fs";
import { ensureAllSlideIds } from "../utils/slide-id.js";

interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}

export const generateSlideIdsSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file"),
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

export async function generateSlideIds({
  filePath,
}: z.infer<typeof generateSlideIdsSchema>): Promise<ToolResponse> {
  try {
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

    if (slides.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: "No slides found in file",
                file: filePath,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // Ensure all slides have IDs
    const { slides: updatedSlides, idToIndex } = ensureAllSlideIds(slides);

    // Check if any changes were made
    const changesNeeded = slides.some((slide, index) => slide !== updatedSlides[index]);

    if (!changesNeeded) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                message: "All slides already have IDs",
                totalSlides: slides.length,
                file: filePath,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    // Write updated content
    const newContent = joinSlides(frontmatter, updatedSlides);
    await fs.writeFile(filePath, newContent, "utf-8");

    // Create ID summary
    const idSummary = Array.from(idToIndex.entries()).map(([id, index]) => ({
      position: index + 1,
      slideId: id,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: true,
              message: "Generated slide IDs successfully",
              totalSlides: updatedSlides.length,
              idsGenerated: idSummary.length,
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
          text: `Error generating slide IDs: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
    };
  }
}
