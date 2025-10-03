/**
 * Academic theme layout definitions
 * Based on academic_custom.css theme
 */

export interface SlideLayout {
  name: string;
  description: string;
  className?: string;
  params: {
    [key: string]: {
      type: "string" | "array" | "number";
      description: string;
      required: boolean;
      maxLength?: number;
    };
  };
  template: (params: any) => string;
}

/**
 * Title slide layout - centered title and subtitle
 */
export const titleLayout: SlideLayout = {
  name: "title",
  description: "Title slide with centered title and subtitle",
  className: "title",
  params: {
    title: {
      type: "string",
      description: "Main title",
      required: true,
      maxLength: 60,
    },
    subtitle: {
      type: "string",
      description: "Subtitle",
      required: false,
      maxLength: 100,
    },
  },
  template: (params) => {
    let slide = `# ${params.title}\n`;
    if (params.subtitle) {
      slide += `## ${params.subtitle}\n`;
    }
    slide += `\n<!-- _class: title -->`;
    return slide;
  },
};

/**
 * Lead slide layout - left-aligned with maroon color
 */
export const leadLayout: SlideLayout = {
  name: "lead",
  description: "Lead slide with left-aligned maroon headings",
  className: "lead",
  params: {
    heading: {
      type: "string",
      description: "Main heading",
      required: true,
      maxLength: 80,
    },
    content: {
      type: "string",
      description: "Content (markdown supported)",
      required: false,
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

/**
 * Default content slide
 */
export const contentLayout: SlideLayout = {
  name: "content",
  description: "Standard content slide with optional heading",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: false,
      maxLength: 80,
    },
    content: {
      type: "string",
      description: "Content (markdown supported)",
      required: true,
    },
  },
  template: (params) => {
    let slide = "";
    if (params.heading) {
      slide += `# ${params.heading}\n\n`;
    }
    slide += params.content;
    return slide;
  },
};

/**
 * Table slide layout with various size/alignment options
 */
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

    return slide;
  },
};

/**
 * Multi-column layout using double blockquote syntax
 */
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

    return slide;
  },
};

/**
 * Quote/citation slide with footer blockquote
 */
export const quoteLayout: SlideLayout = {
  name: "quote",
  description: "Quote slide with citation in footer",
  params: {
    heading: {
      type: "string",
      description: "Slide heading",
      required: false,
      maxLength: 80,
    },
    content: {
      type: "string",
      description: "Main content before quote",
      required: false,
    },
    quote: {
      type: "string",
      description: "Quote text",
      required: true,
      maxLength: 300,
    },
    citation: {
      type: "string",
      description: "Citation/source",
      required: false,
      maxLength: 100,
    },
  },
  template: (params) => {
    let slide = "";
    if (params.heading) {
      slide += `# ${params.heading}\n\n`;
    }
    if (params.content) {
      slide += `${params.content}\n\n`;
    }

    // Footer blockquote
    slide += `> ${params.quote}`;
    if (params.citation) {
      slide += ` — ${params.citation}`;
    }

    return slide;
  },
};

/**
 * All available layouts
 */
export const academicLayouts = {
  title: titleLayout,
  lead: leadLayout,
  content: contentLayout,
  table: tableLayout,
  "multi-column": multiColumnLayout,
  quote: quoteLayout,
} as const;

/**
 * Get layout by name
 */
export function getLayout(name: string): SlideLayout | null {
  return (academicLayouts[name as keyof typeof academicLayouts] as SlideLayout) || null;
}

/**
 * Get all layout names
 */
export function getLayoutNames(): string[] {
  return Object.keys(academicLayouts);
}

/**
 * Get all layouts info
 */
export function getAllLayoutsInfo() {
  return Object.entries(academicLayouts).map(([name, layout]) => ({
    name,
    description: layout.description,
    className: layout.className,
    params: Object.entries(layout.params).map(([paramName, paramDef]) => ({
      name: paramName,
      ...paramDef,
    })),
  }));
}
