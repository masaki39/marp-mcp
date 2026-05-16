import { describe, expect, it } from "@jest/globals";
import { promises as fs } from "fs";
import path from "path";
import {
  getAvailableThemeNames,
  getTheme,
} from "../themes/index.js";
import { getAvailableStyleNames, getStyle } from "../styles/index.js";

const ROOT = path.resolve(process.cwd());
const README_PATH = path.join(ROOT, "README.md");

describe("readme generator", () => {
  it("writes README.md", async () => {
    const content = buildReadme();

    await fs.writeFile(README_PATH, content, "utf-8");
    const saved = await fs.readFile(README_PATH, "utf-8");
    expect(saved).toBe(content);
  });
});

function buildReadme(): string {
  // --- Dynamic: style selection list ---
  const styleList = getAvailableStyleNames()
    .filter((n) => n !== "default")
    .join("`, `");

  // --- Dynamic: Default theme layout table ---
  const defaultTheme = getTheme("default")!;
  const defaultThemeRows = Object.entries(defaultTheme.layouts)
    .map(([name, layout]) => `| \`${name}\` | ${layout.description} |`)
    .join("\n");

  // --- Dynamic: Style layout tables ---
  const styleLayoutSections = getAvailableStyleNames()
    .filter((n) => n !== "default")
    .map((styleName) => {
      const style = getStyle(styleName)!;
      const rows = Object.entries(style.layouts)
        .map(([name, layout]) => `| \`${name}\` | ${layout.description} |`)
        .join("\n");
      return `#### \`${styleName}\` — ${style.description}\n\n<details>\n<summary>Show layouts</summary>\n\n| Layout | Description |\n|--------|-------------|\n${rows}\n\n</details>`;
    })
    .join("\n\n");

  // --- Dynamic: Example links ---
  const themeLinks = getAvailableThemeNames()
    .map(
      (name) =>
        `- [${capitalize(name)} theme](https://masaki39.github.io/marp-mcp/example-${name}-theme.html)`,
    )
    .join("\n");

  const styleLinks = getAvailableStyleNames()
    .filter((n) => getStyle(n)!.css !== "")
    .map(
      (name) =>
        `- [Default theme, ${name} style](https://masaki39.github.io/marp-mcp/example-default-${name}-style.html)`,
    )
    .join("\n");

  return `# Marp MCP Server

![NPM Downloads](https://img.shields.io/npm/dt/%40masaki39%2Fmarp-mcp)

> [!TIP]
> This package includes a [Claude Code Skill](./skills/marp/SKILL.md). After installing, Claude Code can create Marp presentations via the \`/marp\` command using the built-in CLI — no MCP server configuration required!
>
> **Auto-updating plugin install:**
> \`\`\`
> /plugin marketplace add masaki39/marp-mcp
> /plugin install marp@marp-mcp
> \`\`\`

An MCP server for creating and editing Marp presentations with AI assistance.
This MCP server allows LLMs to edit Markdown files according to a specified layout, supporting the built-in Marp themes (default, Gaia, Uncover) and a rich set of academic and professional presentation styles.

## ⚙️ Setup

### Claude Code

**Option 1 — CLI, user scope** (recommended):

\`\`\`bash
claude mcp add marp-mcp -- npx -y @masaki39/marp-mcp@latest
\`\`\`

**Option 2 — CLI, project scope** (shareable with team via \`.mcp.json\`):

\`\`\`bash
claude mcp add --scope project marp-mcp -- npx -y @masaki39/marp-mcp@latest
\`\`\`

**Option 3 — Manual config** (\`~/.claude/settings.json\` or \`.mcp.json\`):

\`\`\`json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest"]
    }
  }
}
\`\`\`

### Other MCP clients

\`\`\`json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest"]
    }
  }
}
\`\`\`

### Setting server default theme/style

Use \`-t\` / \`--theme\` and \`-s\` / \`--style\` args to set the server-wide default. Choose from themes: \`default\`, \`gaia\`, \`uncover\`. Styles: \`default\`, \`${styleList}\`:

\`\`\`json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest", "-t", "default", "-s", "rich"]
    }
  }
}
\`\`\`

Omitting these flags defaults to \`default\` theme and \`default\` style.

## 🛠️ Tools

| Tool | Description |
|------|-------------|
| \`list_themes_and_styles\` | List all available themes and styles; shows current server defaults |
| \`list_layouts\` | List available slide layouts for a theme/style combination |
| \`create_presentation\` | Create a new presentation with frontmatter and title slide in one step |
| \`manage_slide\` | Insert, replace, or delete slides using slide IDs (ID-based operations) |
| \`set_frontmatter\` | Ensure \`marp\`, \`theme\`, \`header\`, and \`paginate\` frontmatter fields are present |
| \`read_slide\` | Read slide content by ID or list all slides with their IDs and positions |
| \`generate_slide_ids\` | Generate stable UUIDs for every slide (safe to re-run) |
| \`export_slide\` | Export to HTML, PDF, or PPTX using marp-cli |
| \`generate_agenda\` | Auto-generate an agenda slide; adds numbered icons to section slides for view-transition morphing (HTML only) |
| \`add_image_transition\` | Insert a full-screen background image slide before a target slide and tag images for view-transition morphing (HTML only) |

### Per-call theme/style override

\`list_layouts\`, \`manage_slide\`, and \`set_frontmatter\` accept optional \`theme\` and \`style\` parameters to override the server default for a single call. This lets one server instance handle all theme/style combinations without restarting:

\`\`\`json
{ "theme": "gaia", "style": "rich" }
\`\`\`

Omit either parameter to fall back to the server default.

## 🎨 Example

Rendered samples (GitHub Pages):

${themeLinks}
${styleLinks}

## 📐 Available Layouts

### Default theme

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
${defaultThemeRows}

</details>

### Styles

${styleLayoutSections}

## 💡 Tips

### Adjusting font size

Add an inline style to any slide to override the font size for the whole presentation:

\`\`\`html
<style>section { font-size: 1em; }</style>
\`\`\`

The \`academic\` style sets \`font-size: 0.95em\` by default.

### Image morphing transitions (HTML only)

Use \`generate_agenda\` and \`add_image_transition\` to enable CSS View Transition morphing effects:

- \`generate_agenda\` — scans section slides, inserts an agenda with numbered icons, and adds matching icons to each section slide so the icon morphs between agenda and section views.
- \`add_image_transition\` — inserts a full-screen background slide before an image slide and tags both with matching \`view-transition-name\` so the image appears to zoom in as you advance.

Both require HTML export (\`export_slide\` with \`format: "html"\`) to render transitions.

## 🔧 Development

### Working with Examples

Generate markdown examples:
\`\`\`bash
pnpm run examples:generate
\`\`\`

Generate HTML files locally:
\`\`\`bash
pnpm run examples:html
\`\`\`

Preview examples with live reload (recommended for testing):
\`\`\`bash
pnpm run examples:server
# Open http://localhost:8080 in your browser
\`\`\`

**Note**: HTML files are automatically generated and deployed to GitHub Pages by CI/CD. They are not committed to git.

## 📄 License

MIT License

## 🔗 Links

- [GitHub](https://github.com/masaki39/marp-mcp)
- [npm](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp](https://marp.app/)
- [Model Context Protocol](https://modelcontextprotocol.io)
`;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
