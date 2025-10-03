/**
 * Multi-column layout using double blockquote syntax
 */

import type { SlideLayout } from "./types.js";

export const multiColumnLayout: SlideLayout = {
  name: "multi-column",
  description: "Multi-column layout (2-3 columns) using double blockquote",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: false,
      maxLength: 80,
    },
    columns: {
      type: "array",
      description: "Array of column contents (markdown supported)",
      required: true,
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
      slide += `# ${params.heading}\n\n`;
    }

    // Generate double blockquote for each column
    const columns = params.columns as string[];
    const columnBlocks = columns.map((col) => {
      const lines = col.trim().split("\n");
      return lines.map((line) => `> > ${line}`).join("\n");
    });

    slide += columnBlocks.join("\n>\n");

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
