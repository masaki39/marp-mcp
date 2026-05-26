/**
 * Academic style - Two-column layout
 */

import type { SlideLayout } from "../../../themes/types.js";

export const twoColumnLayout: SlideLayout = {
  name: "two-column",
  description:
    "Two-column panel layout. Use panelStyle='comparison' to highlight right panel (maroon) vs left panel (gray) for conventional vs proposed comparisons.",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: true,
      maxLength: 54,
    },
    panelStyle: {
      type: "string",
      description: "Panel visual style: 'symmetric' (default, both panels equal) or 'comparison' (left=gray/conventional, right=maroon/proposed)",
      required: false,
      enum: ["symmetric", "comparison"],
    },
    leftTitle: {
      type: "string",
      description: "Left panel title",
      required: true,
      maxLength: 40,
    },
    leftList: {
      type: "array",
      description: "Left panel list items",
      required: true,
      maxItems: 6,
    },
    rightTitle: {
      type: "string",
      description: "Right panel title",
      required: true,
      maxLength: 40,
    },
    rightList: {
      type: "array",
      description: "Right panel list items",
      required: true,
      maxItems: 6,
    },
    citations: {
      type: "string",
      description: "Citation (no line break)",
      required: false,
      maxLength: 130,
    },
  },
  template: (params) => {
    const isComparison = params.panelStyle === "comparison";
    const containerClass = isComparison ? "acad-comparison" : "acad-2col";
    const panelClass = isComparison ? "acad-comparison-panel" : "acad-2col-panel";

    const renderPanel = (title: unknown, items: unknown) => {
      let html = `<div class="${panelClass}">`;
      if (title) {
        html += `\n<h3>${title}</h3>`;
      }
      if (Array.isArray(items) && items.length > 0) {
        html += `\n<ul>\n${items.map((item) => `<li>${item}</li>`).join("\n")}\n</ul>`;
      }
      html += `\n</div>`;
      return html;
    };

    const left = renderPanel(params.leftTitle, params.leftList);
    const right = renderPanel(params.rightTitle, params.rightList);

    let slide = `## ${params.heading}\n\n<div class="${containerClass}">\n${left}\n${right}\n</div>`;
    if (params.citations) {
      slide += `\n\n> ${params.citations}`;
    }
    return slide;
  },
};
