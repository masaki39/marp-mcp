# Marp MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for managing [Marp](https://marp.app/) presentation projects with academic theme support. Optimized for use with Claude Code, Cursor, and other AI-powered editors.

## Features

- 🎨 **Academic Theme Support** - Pre-configured academic_custom.css theme
- 📁 **Project Initialization** - Automatic directory structure setup
- 🎯 **Structured Slide Generation** - 6 layout templates for consistent design
- 🔧 **Editor Integration** - Designed for Claude Code and Cursor
- 📝 **Markdown Output** - Generate slides as markdown strings for easy editing

## Installation

### Via npx (Recommended)

```bash
npx @masaki39/marp-mcp
```

### Global Installation

```bash
npm install -g @masaki39/marp-mcp
```

### Local Installation

```bash
npm install @masaki39/marp-mcp
```

## Configuration

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "marp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp"]
    }
  }
}
```

Or with global installation:

```json
{
  "mcpServers": {
    "marp": {
      "command": "marp-mcp"
    }
  }
}
```

### Claude Code / Cursor

The server works seamlessly with Claude Code and Cursor. The generated markdown can be directly inserted into your editor.

## Available Tools

### 1. `init_presentation`

Initialize a new Marp presentation project with complete directory structure.

**Parameters:**
- `projectPath` (string) - Directory where project will be created
- `projectName` (string) - Name of the presentation project
- `presentationTitle` (string) - Title of the presentation
- `presentationSubtitle` (string, optional) - Subtitle
- `description` (string, optional) - Brief description

**Generated Structure:**
```
my-presentation/
├── slides.md                    # Main presentation file
├── themes/
│   └── academic_custom.css      # Academic theme
├── attachments/
│   ├── images/                  # Image files
│   ├── videos/                  # Video files
│   └── data/                    # Data files
├── .gitignore
└── README.md
```

**Example:**
```javascript
{
  "projectPath": "/Users/yourname/presentations",
  "projectName": "research-2024",
  "presentationTitle": "Research Findings",
  "presentationSubtitle": "Annual Report 2024",
  "description": "Research results presentation"
}
```

### 2. `generate_slide`

Generate a slide using academic theme layouts. Returns markdown string for copy-paste.

**Parameters:**
- `layoutType` (string) - Layout type (title, lead, content, table, multi-column, quote)
- `params` (object) - Layout-specific parameters

**Example:**
```javascript
{
  "layoutType": "title",
  "params": {
    "title": "Presentation Title",
    "subtitle": "Subtitle"
  }
}
```

### 3. `list_slide_layouts`

List all available slide layouts with their parameters and descriptions.

**No parameters required.**

## Available Layouts

### Title Slide (`title`)
Centered title and subtitle with `.title` class.

**Parameters:**
- `title` (required, max 60 chars)
- `subtitle` (optional, max 100 chars)

**Output:**
```markdown
# Presentation Title
## Subtitle

<!-- _class: title -->
```

### Lead Slide (`lead`)
Left-aligned with maroon color headings using `.lead` class.

**Parameters:**
- `heading` (required, max 80 chars)
- `content` (optional, markdown supported)

**Output:**
```markdown
# Main Heading

Content goes here

<!-- _class: lead -->
```

### Content Slide (`content`)
Standard content slide with optional heading.

**Parameters:**
- `heading` (optional, max 80 chars)
- `content` (required, markdown supported)

**Output:**
```markdown
# Heading

Content with markdown support
- List item 1
- List item 2
```

### Table Slide (`table`)
Table with customizable size and alignment.

**Parameters:**
- `heading` (optional, max 80 chars)
- `tableMarkdown` (required, markdown table)
- `tableClass` (optional: "center", "100", "tiny", "small", "large")

**Output:**
```markdown
# Table Heading

| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |

<!-- _class: table-center table-100 -->
```

### Multi-Column Slide (`multi-column`)
2-3 column layout using double blockquote syntax.

**Parameters:**
- `heading` (optional, max 80 chars)
- `columns` (required, array of strings)

**Output:**
```markdown
# Comparison

> > Column 1 content
> > - Point 1
>
> > Column 2 content
> > - Point 2
```

### Quote Slide (`quote`)
Quote with citation in footer.

**Parameters:**
- `heading` (optional, max 80 chars)
- `content` (optional)
- `quote` (required, max 300 chars)
- `citation` (optional, max 100 chars)

**Output:**
```markdown
# Heading

Main content

> Quote text here — Citation
```

## Academic Theme Features

The included `academic_custom.css` theme provides:

- **Page numbering** - Automatic slide numbers
- **Custom fonts** - Noto Sans JP and Source Code Pro
- **Color scheme** - Maroon highlights (#800000)
- **Table styles** - Multiple size and alignment options
- **Multi-column support** - Flexible column layouts
- **Header support** - Customizable presentation headers

### CSS Classes

- `.title` - Title slide (centered)
- `.lead` - Lead slide (left-aligned, maroon)
- `.table-center` - Centered table
- `.table-100` - Full-width table
- `.table-tiny` - Small font table (0.7em)
- `.table-small` - Small font table (0.8em)
- `.table-large` - Large font table (1.1em)

## Building Presentations

### Prerequisites

Install Marp CLI:

```bash
npm install -g @marp-team/marp-cli
```

### Build to PDF

```bash
marp slides.md -o slides.pdf
```

### Build to HTML

```bash
marp slides.md -o slides.html
```

### Build to PowerPoint

```bash
marp slides.md -o slides.pptx
```

### Preview in VS Code

Install [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode) extension for live preview.

## Development

### Building from Source

```bash
git clone https://github.com/masaki39/marp-mcp.git
cd marp-mcp
npm install
npm run build
```

### Testing Locally

```bash
npm link
```

Then configure Claude Desktop to use the local version.

## Troubleshooting

### Server Not Starting

Check logs in `~/Library/Logs/Claude/`:
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

### Template Files Not Found

Ensure the package was built correctly:
```bash
npm run build
ls build/templates/
```

Should show:
- `academic_custom.css`
- `slides.template.md`
- `README.template.md`
- `gitignore.template`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Credits

- Academic theme based on [marp-theme-academic](https://github.com/kaisugi/marp-theme-academic) by kaisugi
- Built on [Model Context Protocol](https://modelcontextprotocol.io)
- Powered by [Marp](https://marp.app/)

## Links

- [GitHub Repository](https://github.com/masaki39/marp-mcp)
- [npm Package](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp Documentation](https://marpit.marp.app/)
- [MCP Documentation](https://modelcontextprotocol.io)
