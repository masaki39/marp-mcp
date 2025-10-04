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
  },
  template: (params) => {
    let slide = `# ${params.heading}\n`;
    if (params.content) {
      slide += `\n${params.content}\n`;
    }
    slide += `\n<!-- _class: lead -->`;

    return slide;
  },
};
