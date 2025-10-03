/**
 * Table slide layout with various size/alignment options
 */

import type { SlideLayout } from "./types.js";

export const tableLayout: SlideLayout = {
  name: "table",
  description: "Table slide with customizable size and alignment",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: false,
      maxLength: 80,
    },
    tableMarkdown: {
      type: "string",
      description: "Table in markdown format",
      required: true,
    },
    tableClass: {
      type: "string",
      description: "Table class: center, 100, tiny, small, large (can combine with spaces)",
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
      slide += `# ${params.heading}\n\n`;
    }
    slide += params.tableMarkdown;

    // Build class string
    const classes: string[] = [];
    if (params.tableClass) {
      const tableOpts = params.tableClass.split(/\s+/);
      tableOpts.forEach((opt: string) => {
        if (opt === "center") classes.push("table-center");
        else if (opt === "100") classes.push("table-100");
        else if (["tiny", "small", "large"].includes(opt)) classes.push(`table-${opt}`);
      });
    }

    if (classes.length > 0) {
      slide += `\n\n<!-- _class: ${classes.join(" ")} -->`;
    }

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
