/**
 * Image-right layout - content list with background image on right
 */

import type { SlideLayout } from "./types.js";

export const imageRightLayout: SlideLayout = {
  name: "image-right",
  description: "Slide with image on right and content list (allows more explanation than image-center)",
  params: {
    heading: {
      type: "string",
      description: "Slide heading (max 17 chars, ~10 chars for Japanese)",
      required: true,
      maxLength: 17,
    },
    list: {
      type: "array",
      description: "List items (max 8 items, each max 23 chars, ~14 chars for Japanese)",
      required: true,
      maxItems: 8,
      maxLength: 23,
    },
    imagePath: {
      type: "string",
      description: "Image file path (local paths supported, e.g., ./attachments/image.png)",
      required: true,
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

    // List items
    params.list.forEach((item: string) => {
      slide += `- ${item}\n`;
    });

    // Fixed background image: bg right:50% contain
    slide += `\n![bg right:50% contain](${params.imagePath})`;

    // Citation (single, no line break)
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
