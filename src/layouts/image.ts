/**
 * Image layout - centered image display
 */

import type { SlideLayout } from "./types.js";

export const imageLayout: SlideLayout = {
  name: "image",
  description: "Slide with centered image",
  params: {
    heading: {
      type: "string",
      description: "Slide heading (max 50 chars, displays as h2)",
      required: false,
      maxLength: 50,
    },
    imagePath: {
      type: "string",
      description: "Image file path (local paths supported, e.g., ./attachments/image.png)",
      required: true,
    },
    height: {
      type: "number",
      description: "Image height in pixels (e.g., 330)",
      required: false,
    },
    width: {
      type: "string",
      description: "Image width (e.g., '80%', '500px')",
      required: false,
    },
    citations: {
      type: "array",
      description: "Citations/references (array of strings)",
      required: false,
    },
  },
  template: (params) => {
    let slide = "";

    if (params.heading) {
      slide += `## ${params.heading}\n\n`;
    }

    // Build image directive
    let imageDirective = "![center";

    if (params.height) {
      imageDirective += ` h:${params.height}`;
    }

    if (params.width) {
      imageDirective += ` w:${params.width}`;
    }

    imageDirective += `](${params.imagePath})`;
    slide += imageDirective;

    // Add citations
    if (params.citations && params.citations.length > 0) {
      slide += '\n\n';
      params.citations.forEach((citation: string) => {
        slide += `> ${citation}\n`;
      });
    }

    return slide;
  },
};
