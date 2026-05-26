/**
 * Academic style - Image-center layout
 */

import { readFileSync } from "fs";
import { imageSize } from "image-size";
import type { SlideLayout } from "../../../themes/types.js";

function getImageConstraint(imagePath: string, hPx: number): string {
  try {
    const buffer = readFileSync(imagePath);
    const { width, height } = imageSize(buffer);
    if (!width || !height) return `h:${hPx}`;
    const projectedWidth = hPx * (width / height);
    if (projectedWidth > 1200) return `w:1200`;
    return `h:${hPx}`;
  } catch {
    return `h:${hPx}`;
  }
}

export const imageCenterLayout: SlideLayout = {
  name: "image-center",
  description:
    "Centered image slide. Set figNumber to switch to figure-caption mode (renders 'Fig. X.' label with optional source attribution).",
  className: "acad-img-center",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: true,
      maxLength: 54,
    },
    imagePath: {
      type: "string",
      description: "Image file path (local paths supported)",
      required: true,
    },
    figNumber: {
      type: "string",
      description: "Figure number (e.g., '1', '2a'). When set, renders as 'Fig. X.' format and enables source param.",
      required: false,
      maxLength: 5,
    },
    caption: {
      type: "string",
      description: "Short figure label shown directly below the image (e.g., 'Fig. 1: Overview of the method'). Use this for a one-line label.",
      required: false,
      maxLength: 120,
    },
    source: {
      type: "string",
      description: "Source attribution appended to caption (e.g., 'Adapted from Smith et al., 2024'). Only rendered when figNumber is set.",
      required: false,
      maxLength: 100,
    },
    description: {
      type: "string",
      description: "Explanatory text shown below the image as slide body (distinct from caption: use for a sentence or two of explanation, not a label).",
      required: false,
      maxLength: 75,
    },
    citations: {
      type: "string",
      description: "Citation (no line break)",
      required: false,
      maxLength: 130,
    },
  },
  template: (params) => {
    if (params.figNumber) {
      // Figure-caption mode: acad-figure wrapper with "Fig. X." format
      const hPx = params.citations ? 380 : 430;
      let slide = `## ${params.heading}\n\n`;
      slide += `<div class="acad-figure">\n\n`;
      slide += `![center ${getImageConstraint(params.imagePath as string, hPx)}](${params.imagePath})\n\n`;
      slide += `<div class="acad-figure-caption"><strong>Fig. ${params.figNumber}.</strong> ${params.caption ?? ""}`;
      if (params.source) {
        slide += ` (${params.source})`;
      }
      slide += `</div>\n</div>`;
      if (params.citations) {
        slide += `\n\n> ${params.citations}`;
      }
      return slide;
    }

    // Default image-center mode
    let slide = `<!-- _class: acad-img-center -->\n\n`;
    slide += `## ${params.heading}\n\n`;

    const hPx = params.description && params.citations ? 430 : !params.description && !params.citations ? 530 : 480;
    slide += `![center ${getImageConstraint(params.imagePath as string, hPx)}](${params.imagePath})`;

    if (params.caption) {
      slide += `\n\n<p class="acad-image-caption">${params.caption}</p>`;
    }
    if (params.description) {
      slide += `\n\n${params.description}`;
    }
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }
    return slide;
  },
};
