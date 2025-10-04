/**
 * Two-column layout for comparing or discussing two topics
 */

import type { SlideLayout } from "./types.js";

export const twoColumnLayout: SlideLayout = {
  name: "two-column",
  description: "Two-column layout for comparing or discussing two topics (different from list)",
  params: {
    heading: {
      type: "string",
      description: "Slide heading (max 40 chars, ~22 chars for Japanese)",
      required: true,
      maxLength: 40,
    },
    column1Heading: {
      type: "string",
      description: "Column 1 heading (max 17 chars, ~10 chars for Japanese)",
      required: true,
      maxLength: 17,
    },
    column1List: {
      type: "array",
      description: "Column 1 list items (max 6 items, each max 23 chars, ~14 chars for Japanese)",
      required: true,
      maxItems: 6,
      maxLength: 23,
    },
    column2Heading: {
      type: "string",
      description: "Column 2 heading (max 17 chars, ~10 chars for Japanese)",
      required: true,
      maxLength: 17,
    },
    column2List: {
      type: "array",
      description: "Column 2 list items (max 6 items, each max 23 chars, ~14 chars for Japanese)",
      required: true,
      maxItems: 6,
      maxLength: 23,
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

    // Column 1
    slide += `> > ### ${params.column1Heading}\n> > \n`;
    params.column1List.forEach((item: string) => {
      slide += `> > - ${item}\n`;
    });

    slide += `>\n`;

    // Column 2
    slide += `> > ### ${params.column2Heading}\n> > \n`;
    params.column2List.forEach((item: string) => {
      slide += `> > - ${item}\n`;
    });

    // Citation (single, no line break)
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }

    return slide;
  },
};
