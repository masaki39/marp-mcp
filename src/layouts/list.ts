/**
 * List slide layout - bullet points
 */

import type { SlideLayout } from "./types.js";

export const listLayout: SlideLayout = {
  name: "list",
  description: "List slide with bullet points (max 8 items)",
  params: {
    heading: {
      type: "string",
      description: "Slide heading (max 40 chars, ~22 chars for Japanese)",
      required: true,
      maxLength: 40,
    },
    list: {
      type: "array",
      description: "List items (max 8 items, each max 50 chars, ~30 chars for Japanese)",
      required: true,
      maxItems: 8,
      maxLength: 50,
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

    // Citation (single, no line break)
    if (params.citations) {
      slide += `\n> ${params.citations}`;
    }

    return slide;
  },
};
