/**
 * Section slide layout - centered title for section breaks
 */

import type { SlideLayout } from "./types.js";

export const sectionLayout: SlideLayout = {
  name: "section",
  description: "Section break slide with centered title and subtitle",
  className: "section",
  params: {
    title: {
      type: "string",
      description: "Section title (max 30 chars, ~18 chars for Japanese)",
      required: true,
      maxLength: 30,
    },
    subtitle: {
      type: "string",
      description: "Section subtitle (max 40 chars, ~22 chars for Japanese)",
      required: false,
      maxLength: 40,
    },
  },
  template: (params) => {
    let slide = `# ${params.title}\n`;
    if (params.subtitle) {
      slide += `## ${params.subtitle}\n`;
    }
    slide += `\n<!-- _class: section -->`;
    return slide;
  },
};
