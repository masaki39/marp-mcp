# Marp MCP Server

An MCP server for creating and editing Marp presentations with AI assistance.

## Setup

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "marp-mcp": {
      "command": "npx",
      "args": ["-y", "@masaki39/marp-mcp"]
    }
  }
}
```

## Tools

| Tool | Description |
|------|-------------|
| `list_layouts` | List all available slide layouts with parameters and descriptions |
| `manage_slide` | Insert, replace, or delete slides in a Marp markdown file |

## Available Layouts

| Layout | Description |
|--------|-------------|
| `title` | Title slide with left-aligned heading and metadata |
| `section` | Section divider with centered title and subtitle |
| `list` | Content slide with heading and bullet points or text |
| `table` | Table layout with customizable size and alignment |
| `two-column` | Two-column layout for side-by-side content |
| `image-right` | Layout with image on the right side |
| `image-center` | Centered image layout with adjustable dimensions |

## Example

See the [example presentation](./assets/example.html) demonstrating all available layouts.

The example was created entirely using this MCP server and showcases:
- Title and section slides
- List and table layouts
- Two-column layout
- Image layouts (center and right)

Source: [example.md](./assets/example.md)

## License

MIT License

## Links

- [GitHub](https://github.com/masaki39/marp-mcp)
- [npm](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp](https://marp.app/)
- [Model Context Protocol](https://modelcontextprotocol.io)
