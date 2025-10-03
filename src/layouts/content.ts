/**
 * Default content slide
 */

import type { SlideLayout } from "./types.js";

export const contentLayout: SlideLayout = {
  name: "content",
  description: "Standard content slide with optional h2 heading",
  params: {
    heading: {
      type: "string",
      description: "Slide heading (max 80 chars, displays as h2)",
      required: false,
      maxLength: 80,
    },
    content: {
      type: "string",
      description: "Content (markdown supported, keep concise - max 800 chars recommended)",
      required: true,
      maxLength: 1500,
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
    slide += params.content;

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
