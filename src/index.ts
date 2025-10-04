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
  listLayoutsSchema,
  listLayouts,
} from "./tools/list_layouts.js";
import {
  manageSlideSchema,
  manageSlide,
} from "./tools/manage_slide.js";

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
  "list_layouts",
  "ALWAYS read this first before creating Marp slides - lists all available layouts with parameters and descriptions",
  listLayoutsSchema.shape,
  listLayouts
);

server.tool(
  "manage_slide",
  "Create slides using this tool with appropriate layouts, then fine-tune by direct editing if needed",
  manageSlideSchema.shape,
  manageSlide
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Marp MCP Server v0.3.0 running on stdio");
  console.error("Tools: list_layouts, manage_slide");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
