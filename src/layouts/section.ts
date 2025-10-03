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
      description: "Section title (max 60 chars for optimal display)",
      required: true,
      maxLength: 60,
    },
    subtitle: {
      type: "string",
      description: "Section subtitle (max 100 chars)",
      required: false,
      maxLength: 100,
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
