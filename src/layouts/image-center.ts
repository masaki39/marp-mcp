/**
 * Image layout - centered image display
 */

import type { SlideLayout } from "./types.js";

export const imageLayout: SlideLayout = {
  name: "image-center",
  description: "Slide with centered image (fixed h:350)",
  params: {
    heading: {
      type: "string",
      description: "Slide heading (max 40 chars, ~22 chars for Japanese)",
      required: true,
      maxLength: 40,
    },
    imagePath: {
      type: "string",
      description: "Image file path (local paths supported, e.g., ./attachments/image.png)",
      required: true,
    },
    description: {
      type: "string",
      description: "Image description below image (max 55 chars, ~33 chars for Japanese)",
      required: false,
      maxLength: 55,
    },
    citations: {
      type: "string",
      description: "Citation (max 50 chars, ~30 chars for Japanese, no line break)",
      required: false,
      maxLength: 50,
    },
  },
  template: (params) => {
    let slide = "";

    if (params.heading) {
      slide += `## ${params.heading}\n\n`;
    }

    // Fixed image directive: center h:350
    slide += `![center h:350](${params.imagePath})`;

    // Image description (optional)
    if (params.description) {
      slide += `\n\n${params.description}`;
    }

    // Citation (single, no line break)
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
