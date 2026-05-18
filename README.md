# Marp MCP Server

![NPM Downloads](https://img.shields.io/npm/dt/%40masaki39%2Fmarp-mcp)

> [!TIP]
> This package includes a [Claude Code Skill](./skills/marp/SKILL.md). After installing, Claude Code can create Marp presentations via the `/marp` command using the built-in CLI — no MCP server configuration required!
>
> **Auto-updating plugin install:**
> ```
> /plugin marketplace add masaki39/marp-mcp
> /plugin install marp@marp-mcp
> ```

An MCP server for creating and editing Marp presentations with AI assistance.
This MCP server allows LLMs to edit Markdown files according to a specified layout, supporting the built-in Marp themes (default, Gaia, Uncover) and a rich set of academic and professional presentation styles.

## ⚙️ Setup

### Claude Code

**Option 1 — CLI, user scope** (recommended):

```bash
claude mcp add marp-mcp -- npx -y @masaki39/marp-mcp@latest
```

**Option 2 — CLI, project scope** (shareable with team via `.mcp.json`):

```bash
claude mcp add --scope project marp-mcp -- npx -y @masaki39/marp-mcp@latest
```

**Option 3 — Manual config** (`~/.claude/settings.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest"]
    }
  }
}
```

### Other MCP clients

```json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest"]
    }
  }
}
```

### Setting server default theme/style

Use `-t` / `--theme` and `-s` / `--style` args to set the server-wide default. Choose from themes: `default`, `gaia`, `uncover`. Styles: `default`, `rich`, `minimal`, `dark`, `corporate`, `academic`, `tech`:

```json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp@latest", "-t", "default", "-s", "rich"]
    }
  }
}
```

Omitting these flags defaults to `default` theme and `default` style.

## 🛠️ Tools

| Tool | Description |
|------|-------------|
| `list_themes_and_styles` | List all available themes and styles; shows current server defaults |
| `list_layouts` | List available slide layouts for a theme/style combination |
| `create_presentation` | Create a new presentation with frontmatter and title slide in one step |
| `manage_slide` | Insert, replace, delete, or move slides using slide IDs (ID-based operations) |
| `batch_manage_slides` | Apply multiple slide operations in one call (single file read/write) |
| `set_frontmatter` | Ensure `marp`, `theme`, `header`, and `paginate` frontmatter fields are present |
| `read_slide` | Read slide content by ID or list all slides with their IDs and positions |
| `generate_slide_ids` | Generate stable UUIDs for every slide (safe to re-run) |
| `export_slide` | Export to HTML, PDF, or PPTX using marp-cli |
| `generate_agenda` | Auto-generate an agenda slide; adds numbered icons to section slides for view-transition morphing (HTML only) |
| `add_image_transition` | Insert a full-screen background image slide before a target slide and tag images for view-transition morphing (HTML only) |

### Per-call theme/style override

`list_layouts`, `manage_slide`, and `set_frontmatter` accept optional `theme` and `style` parameters to override the server default for a single call. This lets one server instance handle all theme/style combinations without restarting:

```json
{ "theme": "gaia", "style": "rich" }
```

Omit either parameter to fall back to the server default.

## 🎨 Example

Rendered samples (GitHub Pages):

- [Default theme](https://masaki39.github.io/marp-mcp/example-default-theme.html)
- [Gaia theme](https://masaki39.github.io/marp-mcp/example-gaia-theme.html)
- [Uncover theme](https://masaki39.github.io/marp-mcp/example-uncover-theme.html)
- [Default theme, rich style](https://masaki39.github.io/marp-mcp/example-default-rich-style.html)
- [Default theme, minimal style](https://masaki39.github.io/marp-mcp/example-default-minimal-style.html)
- [Default theme, dark style](https://masaki39.github.io/marp-mcp/example-default-dark-style.html)
- [Default theme, corporate style](https://masaki39.github.io/marp-mcp/example-default-corporate-style.html)
- [Default theme, academic style](https://masaki39.github.io/marp-mcp/example-default-academic-style.html)
- [Default theme, tech style](https://masaki39.github.io/marp-mcp/example-default-tech-style.html)

## 📐 Available Layouts

### Default theme

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
| `title` | Title slide with heading and content |
| `section` | Section break slide with centered title and subtitle |
| `list` | List slide with bullet points (max 8 items) |
| `table` | Table slide with description (max 7 rows) |
| `image-right` | Slide with image on right and content list (allows more explanation than image-center) |
| `image-center` | Slide with centered image (fixed h:350) |
| `content` | Standard content slide with heading and free-form markdown body (supports bullets with -, bold with **, code with backticks) |

</details>

### Styles

#### `rich` — Rich visual style with cards, timelines, grids, gradients, and more

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
| `title` | Hero title slide with dark gradient background |
| `section` | Section divider slide with gradient background |
| `list` | List slide with bullet points |
| `table` | Rich table slide with styled header and zebra stripes |
| `image-right` | Rich image-right slide with content on left and image on right (60:40 split) |
| `image-center` | Rich centered image slide with rounded corners and shadow |
| `image-split` | Image on the left with content list on the right (40:60 split) |
| `timeline` | Vertical timeline with labeled events (use 'Label: Description' format) |
| `card-grid` | Grid of cards with icon, title, and description (use 'Icon|Title|Description' format) |
| `statistics` | Statistics display with large numbers and labels (use 'Number|Label' format) |
| `highlight-box` | Centered gradient message box for key takeaways or announcements |
| `two-column-panel` | Two-column layout with styled panels, optional accent highlight on one panel |
| `three-column-panel` | Three-column layout with styled panels (use 'Title|Content' format) |
| `image-comparison` | Two images side by side with labels for comparison |
| `content` | Free-form markdown content slide |
| `quote` | Quote slide with attribution |
| `process` | Horizontal process flow with numbered steps and arrows |
| `two-column` | Simple two-column layout with headings and lists |
| `big-statement` | Large impactful statement slide with bold centered text |
| `sidebar` | Main content with sidebar for supplementary info, definitions, or references |
| `progress-bar` | Horizontal progress bars for metrics visualization (use 'Label|Value|MaxValue' format) |
| `chart-bar` | Pure CSS horizontal bar chart for data visualization (use 'Label|Value' format) |
| `timeline-horizontal` | Horizontal timeline with labeled events (use 'Label: Description' format) |
| `pull-quote` | Decorative impact quote with large quotation marks, centered layout |
| `bento-grid` | Bento Box modular grid for mixed content (use 'Size|Title|Content' format, Size: small/medium/large) |

</details>

#### `minimal` — Clean, flat design with typography focus and minimal decoration

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
| `title` | Clean black title slide with white text |
| `section` | Simple black section divider slide |
| `content` | Pure markdown content slide |
| `list` | Simple bullet list slide |
| `table` | Minimal table with black header and clean borders |
| `image-right` | Text on left, image on right (60:40 split), clean design |
| `image-center` | Centered image slide, clean and minimal |
| `quote` | Quote slide with left border accent, no extra decoration |
| `two-column` | Two-column layout with a thin divider line |
| `big-statement` | Large impactful statement slide with bold centered text |
| `statistics` | Minimal statistics display with black numbers and thin underline (use 'Number|Label' format) |
| `highlight-box` | Minimal message box for key takeaways |
| `pull-quote` | Minimal decorative impact quote with large quotation marks |
| `agenda` | Clean agenda slide with numbered items and optional time durations (use 'Item name|Duration' format) |
| `comparison` | Side-by-side comparison with explicit left/right titles and list items, separated by a thin divider |

</details>

#### `dark` — Dark mode style with indigo and emerald accents, developer-friendly

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
| `title` | Dark title slide with indigo-violet gradient |
| `section` | Dark section divider with slate-to-indigo gradient |
| `content` | Free-form markdown content slide on dark background |
| `list` | Bullet list slide on dark background |
| `table` | Dark table with indigo header |
| `card-grid` | Dark card grid with icon, title, and description (use 'Icon|Title|Description' format) |
| `timeline` | Dark vertical timeline with indigo-to-emerald gradient line (use 'Label: Description' format) |
| `statistics` | Dark statistics display with large indigo numbers (use 'Number|Label' format) |
| `image-right` | Text on left, image on right on dark background (60:40 split) |
| `terminal` | Terminal-style command display on dark background (prefix lines with '$ ' for commands) |
| `quote` | Dark quote slide with attribution |
| `image-center` | Dark centered image slide |
| `process` | Dark horizontal process flow with numbered steps and arrows |
| `two-column` | Dark two-column layout with panels |
| `big-statement` | Dark large impactful statement slide with bold centered text |
| `highlight-box` | Dark gradient message box for key takeaways or announcements |
| `progress-bar` | Dark horizontal progress bars for metrics visualization (use 'Label|Value|MaxValue' format) |
| `chart-bar` | Dark CSS horizontal bar chart for data visualization (use 'Label|Value' format) |
| `timeline-horizontal` | Dark horizontal timeline with labeled events (use 'Label: Description' format) |
| `code-comparison` | Side-by-side code comparison (Before/After or two languages) |
| `code-showcase` | Code block with language badge, optional explanation text, and optional highlight bullet points |

</details>

#### `corporate` — Professional business style with navy color scheme, structured layouts

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
| `title` | Professional navy gradient title slide |
| `section` | Corporate navy-to-sky section divider slide |
| `content` | Standard business content slide with markdown |
| `list` | Business bullet list slide |
| `table` | Business table with navy header and clean rows |
| `two-column` | Two-column comparison layout with navy-accented panels |
| `three-column` | Three-column layout with sky-accented panels |
| `statistics` | Business metrics display with large navy numbers (use 'Number|Label' format) |
| `process` | Horizontal business process flow with numbered steps |
| `agenda` | Agenda slide with numbered items and optional duration (use 'Item name|Duration' format) |
| `image-right` | Text on left, image on right, professional business style (60:40 split) |
| `highlight-box` | Navy key message box for important announcements or takeaways |
| `quote` | Corporate quote slide with attribution |
| `image-center` | Corporate centered image slide |
| `big-statement` | Corporate large impactful statement slide with bold centered text |
| `sidebar` | Main content with sidebar for supplementary info or references |
| `progress-bar` | Corporate horizontal progress bars for metrics visualization (use 'Label|Value|MaxValue' format) |
| `chart-bar` | Corporate CSS horizontal bar chart for data visualization (use 'Label|Value' format) |
| `pull-quote` | Corporate decorative impact quote with large quotation marks |
| `quadrant` | 2x2 matrix for SWOT, risk analysis, or priority grids |

</details>

#### `academic` — Academic conference presentation style with maroon color scheme, structured for scholarly talks

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
| `title` | Academic title slide with author, affiliation, and date |
| `section` | Maroon section divider with optional number |
| `content` | Free-form markdown content slide |
| `list` | Bullet point list with optional citations |
| `table` | Table with maroon header |
| `two-column` | Two-column panel layout for comparisons or parallel content |
| `image-right` | Content on left, image on right (60:40 split) |
| `image-center` | Centered image with description |
| `figure-caption` | Figure with numbered caption and source attribution |
| `key-message` | Conclusion or key takeaway box with maroon highlight |
| `methodology` | Method step flow diagram (use 'Label|Description' format for steps) |
| `comparison` | Side-by-side comparison (e.g., conventional vs proposed method) |
| `statistics` | Academic statistics display with maroon numbers (use 'Number|Label' format) |
| `sidebar` | Main content with sidebar for definitions, notes, or references |
| `results-table` | Results table with best-value highlighting (prefix cell with * to highlight) |

</details>

#### `tech` — Modern tech/startup style with violet-cyan gradient accents, strong typography for product demos and engineering talks

<details>
<summary>Show layouts</summary>

| Layout | Description |
|--------|-------------|
| `title` | Gradient title slide with optional tagline and event/company name |
| `section` | Dark full-bleed section divider with cyan eyebrow label and bold heading |
| `content` | Standard content slide with heading and free-form markdown body, accented with a violet left border |
| `list` | Bullet list slide with violet arrow markers and thin dividers between items |
| `two-column` | Two-panel layout with violet top borders, ideal for comparing options or features |
| `statistics` | Large gradient metric numbers with optional trend indicators. Use 'Value|Label|Trend' format (trend is optional). |
| `quote` | Stylized pull quote with violet left border, large quote mark, and attribution |
| `highlight-box` | Alert/callout box with color-coded variants: 'info' (cyan), 'warning' (amber), 'success' (green) |
| `feature-grid` | Grid of feature cards, each with an icon, title, and description. Use 'Icon|Title|Description' format. |
| `roadmap` | Horizontal milestone timeline with status indicators. Use 'Phase|Label|Status' format. Status: 'done', 'current', or 'future'. |

</details>

## 💡 Tips

### Adjusting font size

Add an inline style to any slide to override the font size for the whole presentation:

```html
<style>section { font-size: 1em; }</style>
```

The `academic` style sets `font-size: 0.95em` by default.

### Image morphing transitions (HTML only)

Use `generate_agenda` and `add_image_transition` to enable CSS View Transition morphing effects:

- `generate_agenda` — scans section slides, inserts an agenda with numbered icons, and adds matching icons to each section slide so the icon morphs between agenda and section views.
- `add_image_transition` — inserts a full-screen background slide before an image slide and tags both with matching `view-transition-name` so the image appears to zoom in as you advance.

Both require HTML export (`export_slide` with `format: "html"`) to render transitions.

## 🔧 Development

### Working with Examples

Generate markdown examples:
```bash
pnpm run examples:generate
```

Generate HTML files locally:
```bash
pnpm run examples:html
```

Preview examples with live reload (recommended for testing):
```bash
pnpm run examples:server
# Open http://localhost:8080 in your browser
```

**Note**: HTML files are automatically generated and deployed to GitHub Pages by CI/CD. They are not committed to git.

## 📄 License

MIT License

## 🔗 Links

- [GitHub](https://github.com/masaki39/marp-mcp)
- [npm](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp](https://marp.app/)
- [Model Context Protocol](https://modelcontextprotocol.io)
