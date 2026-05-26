import { describe, expect, it, afterAll } from "@jest/globals";
import { promises as fs } from "fs";
import path from "path";
import { setActiveTheme } from "../../themes/index.js";
import {
  getAvailableStyleNames,
  getStyle,
  setActiveStyle,
} from "../index.js";
import type { StyleName } from "../../themes/types.js";

const examplesDir = path.resolve(process.cwd(), "assets/examples");
const examplesMarkdownDir = path.resolve(examplesDir, "md");

const SAMPLE_IMAGE = "https://picsum.photos/1280/720";

/**
 * Sample params for rich style layouts (complete set – no merge with theme).
 */
const richLayoutParams: Record<string, Record<string, unknown>> = {
  title: {
    heading: "Welcome to the Future",
    content: "A bold vision for modern presentations",
  },
  section: {
    title: "Part Two",
    subtitle: "Diving deeper into the details",
  },
  list: {
    heading: "Key Points",
    list: ["Background context", "Insights discovered", "Next steps"],
    citations: "Source: Sample Dataset",
  },
  table: {
    heading: "Data Overview",
    tableMarkdown: [
      "| Item | Value |",
      "| ---- | ----- |",
      "| Alpha | 42 |",
      "| Beta | 37 |",
      "| Gamma | 58 |",
      "| Delta | 21 |",
    ].join("\n"),
    description: "Higher is better.",
    citations: "Source: Sample Stats",
  },
  "image-right": {
    heading: "Architecture Diagram",
    list: ["Ingest", "Process", "Serve"],
    imagePath: SAMPLE_IMAGE,
    citations: "Diagram credit: picsum.photos",
  },
  "image-center": {
    heading: "Workflow Snapshot",
    imagePath: SAMPLE_IMAGE,
    description: "Step-by-step overview.",
    citations: "Figure 1",
  },
  "image-split": {
    heading: "Visual Overview",
    imageUrl: SAMPLE_IMAGE,
    items: ["Clear structure", "Engaging visuals", "Concise messaging"],
  },
  timeline: {
    heading: "Project Milestones",
    items: [
      "Q1 2025: Research & Discovery",
      "Q2 2025: Prototype Development",
      "Q3 2025: Beta Launch",
      "Q4 2025: General Availability",
    ],
  },
  "card-grid": {
    heading: "Core Capabilities",
    cards: [
      "🚀|Performance|Blazing fast response times",
      "🔒|Security|Enterprise-grade protection",
      "📊|Analytics|Real-time insights dashboard",
      "🔌|Integration|Connect with any platform",
    ],
  },
  statistics: {
    heading: "Impact at a Glance",
    stats: ["99.9%|Uptime", "2.5M|Users", "150ms|Avg Latency", "4.8★|Rating"],
    caption: "Data as of Q4 2025",
  },
  "highlight-box": {
    heading: "Key Takeaway",
    content:
      "Simplicity and clarity are the foundations of effective communication.",
  },
  "two-column-panel": {
    heading: "Plan Comparison",
    panel1Title: "Free Tier",
    panel1List: ["5 projects", "Community support", "Basic analytics"],
    panel2Title: "Pro Tier",
    panel2List: ["Unlimited projects", "Priority support", "Advanced analytics"],
    accentPanel: "right",
  },
  "three-column-panel": {
    heading: "Our Process",
    panels: [
      "Discover|We research your needs and goals",
      "Design|We craft a tailored solution",
      "Deliver|We ship and iterate together",
    ],
  },
  "image-comparison": {
    heading: "Before & After",
    image1Url: SAMPLE_IMAGE,
    image1Label: "Before",
    image2Url: SAMPLE_IMAGE,
    image2Label: "After",
  },
  content: {
    heading: "Summary",
    body: "This is a **free-form** markdown slide.\n\n- Point one\n- Point two\n- Point three",
    sidebarTitle: "Key Terms",
    sidebarItems: ["API Gateway: Entry point", "Event Bus: Async messaging", "Service Mesh: Networking"],
  },
  quote: {
    quote: "The best way to predict the future is to invent it.",
    attribution: "Alan Kay",
    content: "A guiding principle for innovation.",
  },
  process: {
    heading: "Development Workflow",
    steps: ["Plan", "Develop", "Test", "Deploy"],
  },
  "two-column": {
    heading: "Comparison",
    leftTitle: "Option A",
    leftList: ["Fast setup", "Low cost", "Community support"],
    rightTitle: "Option B",
    rightList: ["Enterprise features", "SLA guarantee", "Dedicated support"],
  },
  "big-statement": {
    statement: "Less is More",
    subtitle: "The power of simplicity in design",
  },
  "key-message": {
    heading: "Conclusions",
    title: "Key Finding",
    message:
      "Our proposed method demonstrates a 35% improvement in accuracy compared to the baseline approach.",
    note: "Further validation with larger datasets is recommended.",
  },
  methodology: {
    heading: "Study Design",
    steps: [
      "Recruitment|N=120 participants",
      "Randomization|Double-blind RCT",
      "Intervention|12-week protocol",
      "Assessment|Pre/post measures",
      "Analysis|Mixed-effects model",
    ],
    citations: "Protocol registered: UMIN000012345",
  },
  terminal: {
    heading: "Quick Start",
    terminalTitle: "bash",
    lines: [
      "$ npm install my-package",
      "added 42 packages in 1.2s",
      "$ npm run dev",
      "Server running on http://localhost:3000",
    ],
  },
  sidebar: {
    heading: "Architecture Overview",
    content: "The system uses a **microservices** architecture with event-driven communication.\n\n- API Gateway handles routing\n- Each service owns its data",
    sidebarTitle: "Key Terms",
    sidebarItems: ["API Gateway: Entry point", "Event Bus: Async messaging", "Service Mesh: Networking"],
  },
  comparison: {
    heading: "Method Comparison",
    leftTitle: "Conventional Method",
    leftList: ["Manual feature extraction", "Linear classifier", "Limited scalability"],
    rightTitle: "Proposed Method",
    rightList: ["Automated feature learning", "Deep neural network", "Highly scalable"],
    citations: "Based on benchmark results from Dataset X",
  },
  "three-column": {
    heading: "Three Pillars",
    col1Title: "People",
    col1List: ["Collaboration", "Empowerment", "Growth"],
    col2Title: "Process",
    col2List: ["Agile", "CI/CD", "Automation"],
    col3Title: "Technology",
    col3List: ["Cloud-native", "Microservices", "AI-powered"],
  },
  agenda: {
    heading: "Today's Agenda",
    items: [
      "Introduction|10 min",
      "Market Analysis|20 min",
      "Product Roadmap|30 min",
      "Q&A|15 min",
    ],
  },
  "progress-bar": {
    heading: "Project Completion",
    metrics: [
      "Frontend|85|100",
      "Backend|70|100",
      "Testing|45|100",
      "Documentation|30|100",
    ],
    caption: "Updated weekly",
  },
  "chart-bar": {
    heading: "Revenue by Region",
    bars: [
      "North America|450",
      "Europe|380",
      "Asia Pacific|290",
      "Latin America|120",
    ],
    caption: "In millions USD, FY2025",
  },
  "timeline-horizontal": {
    heading: "Product Roadmap",
    items: [
      "Q1: Research Phase",
      "Q2: Alpha Release",
      "Q3: Beta Launch",
      "Q4: General Availability",
    ],
  },
  "pull-quote": {
    quote: "Design is not just what it looks like. Design is how it works.",
    attribution: "Steve Jobs",
    context: "From a 2003 New York Times interview",
  },
  "bento-grid": {
    heading: "Feature Highlights",
    cells: [
      "large|Real-time Analytics|Monitor your data with live dashboards",
      "small|Fast|Sub-100ms responses",
      "small|Secure|Enterprise-grade encryption",
      "medium|Easy Integration|Connect with 50+ services out of the box",
    ],
  },
  "code-comparison": {
    heading: "Migration Guide",
    leftTitle: "Before",
    leftCode: "const data = fetch(url)\\nconst json = data.json()\\nconsole.log(json)",
    rightTitle: "After",
    rightCode: "const data = await fetch(url)\\nconst json = await data.json()\\nconsole.log(json)",
    language: "js",
  },
  "code-showcase": {
    heading: "Async/Await Pattern",
    code: "async function fetchUser(id: string) {\\n  const res = await fetch(`/api/users/${id}`)\\n  if (!res.ok) throw new Error('Not found')\\n  return res.json() as Promise<User>\\n}",
    language: "TypeScript",
    explanation: "Using async/await keeps asynchronous code readable and avoids callback hell.",
    highlights: [
      "await suspends execution without blocking the thread",
      "Error handling with try/catch works naturally",
    ],
  },
  "feature-grid": {
    heading: "Core Capabilities",
    features: [
      "🚀|Fast Deployment|Ship to production in minutes, not days",
      "🔒|Enterprise Security|SOC 2 Type II compliant infrastructure",
      "📊|Real-time Analytics|Live dashboards with sub-second latency",
      "🔌|Integrations|Connect with 100+ services out of the box",
      "🤖|AI-Powered|Built-in intelligence for smart automation",
    ],
  },
  roadmap: {
    heading: "Product Roadmap",
    subtitle: "FY2025–2026",
    milestones: [
      "Q1|Foundation|done",
      "Q2|Beta Launch|done",
      "Q3|GA Release|current",
      "Q4|Enterprise Tier|future",
      "Q1 2026|AI Features|future",
    ],
  },
  quadrant: {
    heading: "Priority Matrix",
    topLeftTitle: "High Impact / Low Effort",
    topLeftItems: ["Quick wins", "Automation tasks"],
    topRightTitle: "High Impact / High Effort",
    topRightItems: ["Major features", "Platform migration"],
    bottomLeftTitle: "Low Impact / Low Effort",
    bottomLeftItems: ["Minor fixes", "UI tweaks"],
    bottomRightTitle: "Low Impact / High Effort",
    bottomRightItems: ["Legacy cleanup", "Over-engineering"],
  },
};

describe("style example generator", () => {
  afterAll(() => {
    setActiveTheme("default");
    setActiveStyle("default");
  });

  it("writes markdown examples for every style", async () => {
    await fs.mkdir(examplesMarkdownDir, { recursive: true });

    const styleNames = getAvailableStyleNames();

    for (const styleName of styleNames) {
      const style = getStyle(styleName);
      if (!style) {
        throw new Error(`Style "${styleName}" not found`);
      }

      // Skip styles with no layouts (e.g. default)
      const layoutNames = Object.keys(style.layouts);
      if (layoutNames.length === 0) {
        continue;
      }

      const markdown = buildExampleMarkdown(styleName, style.layouts, layoutNames);
      const filePath = path.join(
        examplesMarkdownDir,
        `example-default-${styleName}-style.md`,
      );
      await fs.writeFile(filePath, markdown, "utf-8");
      const savedMarkdown = await fs.readFile(filePath, "utf-8");
      expect(savedMarkdown).toBe(markdown);
    }
  }, 30000);
});

// Layouts that contain an image eligible for morphing transitions
const IMAGE_LAYOUTS = new Set(["image-center", "image-right"]);

const ICON_BASE = "https://icongr.am/material/numeric-{N}-circle.svg";

const IMG_FULLSCREEN_CSS = `section.img-fullscreen {
  padding: 0;
  background: #111;
  overflow: hidden;
}
section.img-fullscreen > p {
  position: absolute;
  inset: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
section.img-fullscreen img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}`;

function addMorphNameToAlt(slideContent: string, morphName: string): string {
  // Prepend morph name to alt of the first non-bg image in the slide.
  // Marp preserves non-keyword alt text as the HTML alt attribute,
  // so img[alt~="name"] works for both inline and bg images.
  return slideContent.replace(
    /!\[(?!bg\s)([^\]]*)\]\(([^)'"]+)\)/,
    (_, alt, url) => {
      const newAlt = alt.trim() ? `${morphName} ${alt.trim()}` : morphName;
      return `![${newAlt}](${url})`;
    },
  );
}

function buildMorphCss(morphNames: string[]): string {
  return morphNames
    .map((name) => `img[alt~="${name}"] { view-transition-name: ${name}; }`)
    .join("\n");
}

function buildStepCssInline(count: number): string {
  const rules = Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return `img[alt="${n}"] { view-transition-name: step-${n}; }`;
  }).join("\n");
  return `img[title~="step"] {\n  height: 1em;\n  position: relative;\n  top: -0.1em;\n  vertical-align: middle;\n  width: 1em;\n}\n${rules}`;
}

function extractHeading(slideContent: string): string {
  const m = slideContent.match(/^#{1,3}\s+(.+)/m);
  return m ? m[1].trim() : "Section";
}

function addSectionIconInline(slideContent: string, n: number): string {
  if (slideContent.includes("'step'") || slideContent.includes('"step"')) return slideContent;
  const url = `${ICON_BASE.replace("{N}", String(n))}?color=ffffff`;
  const icon = `![${n} w:192 h:192](${url} 'step')`;
  const lines = slideContent.split("\n");
  const hi = lines.findIndex((l) => /^#{1,3}\s/.test(l));
  if (hi === -1) return `${slideContent.trim()}\n\n${icon}`;
  lines.splice(hi, 0, icon, "");
  return lines.join("\n");
}

function buildExampleMarkdown(
  styleName: StyleName,
  layouts: Record<string, { template: (params: Record<string, unknown>) => string }>,
  layoutNames: string[],
): string {
  setActiveTheme("default");
  setActiveStyle(styleName);

  const style = getStyle(styleName);
  if (!style) {
    throw new Error(`Style "${styleName}" not found`);
  }

  const morphNames: string[] = [];
  const slides: string[] = [];

  for (const layoutName of layoutNames) {
    const layout = layouts[layoutName];
    if (!layout) {
      throw new Error(`Layout "${layoutName}" not found in style "${styleName}"`);
    }

    const params = richLayoutParams[layoutName];
    if (!params) {
      throw new Error(
        `Missing sample params for layout "${layoutName}" in style "${styleName}"`,
      );
    }

    const content = layout.template(params);
    let slideContent = `<!-- layout: ${layoutName} -->\n${content.trim()}`;

    if (IMAGE_LAYOUTS.has(layoutName)) {
      const morphName = `img-morph-${morphNames.length + 1}`;
      morphNames.push(morphName);
      const taggedContent = addMorphNameToAlt(slideContent, morphName);
      // Full-screen slide: uses img-fullscreen class with inline img so
      // view-transition-name applies to a real DOM element (not a CSS background).
      const bgSlide = `<!-- _class: img-fullscreen -->\n<!-- _paginate: false -->\n<!-- _header: "" -->\n<!-- _footer: "" -->\n\n![${morphName}](${SAMPLE_IMAGE})`;
      slides.push(bgSlide);
      slides.push(taggedContent);
    } else {
      slides.push(slideContent);
    }
  }

  // For academic style: add agenda + section icons
  const sectionIndices: number[] = [];
  if (styleName === "academic") {
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].includes("_class: acad-section")) {
        sectionIndices.push(i);
      }
    }

    if (sectionIndices.length > 0) {
      // Add icons to section slides (modify in-place)
      sectionIndices.forEach((idx, i) => {
        slides[idx] = addSectionIconInline(slides[idx], i + 1);
      });

      // Build agenda slide
      const agendaItems = sectionIndices
        .map((idx, i) => {
          const n = i + 1;
          const url = `${ICON_BASE.replace("{N}", String(n))}?color=666666`;
          return `- ![${n}](${url} 'step') ${extractHeading(slides[idx])}`;
        })
        .join("\n");
      const agendaSlide = `## Agenda\n\n${agendaItems}`;

      // Insert agenda before first section slide
      slides.splice(sectionIndices[0], 0, agendaSlide);
    }
  }

  const hasMorphing = morphNames.length > 0;
  const hasAgenda = sectionIndices.length > 0;

  const frontmatterLines = [
    "---",
    "marp: true",
    "theme: default",
    `header: Example Labs | default theme, ${styleName} style`,
    "paginate: true",
  ];

  if (hasMorphing || hasAgenda) {
    frontmatterLines.push("transition: fade");
  }

  let fullCss = style.css;
  {
    const extras: string[] = [];
    if (hasMorphing) {
      extras.push(IMG_FULLSCREEN_CSS);
      extras.push(buildMorphCss(morphNames));
    }
    if (hasAgenda) extras.push(buildStepCssInline(sectionIndices.length));
    if (extras.length > 0) fullCss = `${style.css}\n${extras.join("\n")}`;
  }

  if (fullCss) {
    frontmatterLines.push(`style: |`);
    for (const line of fullCss.split("\n")) {
      frontmatterLines.push(`  ${line}`);
    }
  }

  frontmatterLines.push("---");

  return [
    ...frontmatterLines,
    "",
    slides.join("\n\n---\n\n"),
    "",
  ].join("\n");
}
