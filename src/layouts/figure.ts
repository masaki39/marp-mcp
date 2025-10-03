/**
 * Figure layout - content with background image
 */

import type { SlideLayout } from "./types.js";

export const figureLayout: SlideLayout = {
  name: "figure",
  description: "Slide with background image and content overlay",
  params: {
    heading: {
      type: "string",
      description: "Slide heading (max 50 chars, displays as h2)",
      required: false,
      maxLength: 50,
    },
    content: {
      type: "string",
      description: "Content text (max 300 chars recommended, markdown supported)",
      required: false,
      maxLength: 500,
    },
    imagePath: {
      type: "string",
      description: "Image file path (local paths supported, e.g., ./attachments/image.png)",
      required: true,
    },
    imagePosition: {
      type: "string",
      description: "Image position: 'right' or 'left' (default: 'right')",
      required: false,
    },
    imageSize: {
      type: "string",
      description: "Image size: 'cover' or 'contain' (default: 'contain')",
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
      slide += `## ${params.heading}\n\n`;
    }

    if (params.content) {
      slide += `${params.content}\n\n`;
    }

    // Build background image directive
    const position = params.imagePosition || 'right';
    const size = params.imageSize || 'contain';
    slide += `![bg ${position} ${size}](${params.imagePath})`;

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
