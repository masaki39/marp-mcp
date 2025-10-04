#!/usr/bin/env node

/**
 * Marp MCP Server
 * A Model Context Protocol server for managing Marp presentation projects
 * Optimized for Claude Code and Cursor
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import tools
import {
  listSlideLayoutsSchema,
  listSlideLayouts,
  manageSlideSchema,
  manageSlide,
} from "./tools/generate.js";

// Create server instance
const server = new McpServer({
  name: "marp-mcp",
  version: "0.3.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register tools
server.tool(
  "list_slide_layouts",
  "List all available slide layouts with their parameters and descriptions",
  listSlideLayoutsSchema.shape,
  listSlideLayouts
);

server.tool(
  "manage_slide",
  "Manage slides in a Marp markdown file (insert, replace, or delete slides)",
  manageSlideSchema.shape,
  manageSlide
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Marp MCP Server v0.3.0 running on stdio");
  console.error("Tools: list_slide_layouts, manage_slide");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
