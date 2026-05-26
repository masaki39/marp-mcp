/**
 * Academic style - Content layout
 */

import type { SlideLayout } from "../../../themes/types.js";

export const contentLayout: SlideLayout = {
  name: "content",
  description:
    "Free-form markdown content slide. Add sidebarTitle/sidebarItems to show a sidebar panel on the right side.",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: true,
      maxLength: 54,
    },
    body: {
      type: "string",
      description: "Free-form markdown body",
      required: true,
    },
    sidebarTitle: {
      type: "string",
      description: "Sidebar heading (enables sidebar when provided)",
      required: false,
      maxLength: 60,
    },
    sidebarItems: {
      type: "array",
      description: "Sidebar list items (enables sidebar when provided)",
      required: false,
      maxItems: 8,
    },
  },
  template: (params) => {
    const hasSidebar =
      params.sidebarTitle || (Array.isArray(params.sidebarItems) && params.sidebarItems.length > 0);

    if (!hasSidebar) {
      return `## ${params.heading}\n\n${params.body}`;
    }

    const items = Array.isArray(params.sidebarItems) ? (params.sidebarItems as string[]) : [];
    const sidebarList = items.map((item) => `<li>${item}</li>`).join("\n");
    let sidebarInner = "";
    if (params.sidebarTitle) {
      sidebarInner += `<h4>${params.sidebarTitle}</h4>\n`;
    }
    sidebarInner += `<ul>\n${sidebarList}\n</ul>`;

    return `## ${params.heading}\n\n<div class="acad-sidebar-layout">\n<div class="acad-sidebar-main">\n\n${params.body}\n\n</div>\n<div class="acad-sidebar" style="font-size: 0.8em">\n${sidebarInner}\n</div>\n</div>`;
  },
};
