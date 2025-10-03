#!/usr/bin/env node

/**
 * Marp MCP Server
 * A Model Context Protocol server for managing Marp presentation projects
 * Optimized for Claude Code and Cursor
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import tools
import { initPresentationSchema, initPresentation } from "./tools/init.js";
import {
  listSlideLayoutsSchema,
  listSlideLayouts,
  manageSlideSchema,
  manageSlide,
} from "./tools/generate.js";

// Create server instance
const server = new McpServer({
  name: "marp-mcp",
  version: "2.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register tools
server.tool(
  "init_presentation",
  "Initialize a new Marp presentation project with directory structure, theme, and templates",
  initPresentationSchema.shape,
  initPresentation
);

server.tool(
  "list_slide_layouts",
  "List all available slide layouts with their parameters and descriptions",
  listSlideLayoutsSchema.shape,
  listSlideLayouts
);

server.tool(
  "manage_slide",
  "Manage slides in a Marp presentation file (insert, replace, or delete slides)",
  manageSlideSchema.shape,
  manageSlide
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Marp MCP Server v2.0 running on stdio");
  console.error("Optimized for Claude Code and Cursor");
  console.error("Tools: init_presentation, manage_slide, list_slide_layouts");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
