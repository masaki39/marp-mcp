/**
 * Title slide layout - presentation title with author info
 */

import type { SlideLayout } from "./types.js";

export const titleLayout: SlideLayout = {
  name: "title",
  description: "Title slide with heading and content (left-aligned, maroon color)",
  className: "lead",
  params: {
    heading: {
      type: "string",
      description: "Main heading (max 80 chars for optimal display)",
      required: true,
      maxLength: 80,
    },
    content: {
      type: "string",
      description: "Content like author info (markdown supported, keep concise)",
      required: false,
      maxLength: 500,
    },
    citations: {
      type: "array",
      description: "Citations/references (array of strings)",
      required: false,
    },
  },
  template: (params) => {
    let slide = `# ${params.heading}\n`;
    if (params.content) {
      slide += `\n${params.content}\n`;
    }
    slide += `\n<!-- _class: lead -->`;

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
