/**
 * MCP Server setup and startup
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { getActiveTheme } from "./themes/index.js";
import { getActiveStyle } from "./styles/index.js";
import { info } from "./utils/logger.js";

import {
  listLayoutsSchema,
  listLayouts,
} from "./tools/list_layouts.js";
import {
  manageSlideSchema,
  manageSlide,
} from "./tools/manage_slide.js";
import {
  generateSlideIdsSchema,
  generateSlideIds,
} from "./tools/generate_slide_ids.js";
import {
  setFrontmatterSchema,
  setFrontmatter,
} from "./tools/set_frontmatter.js";
import {
  readSlideSchema,
  readSlide,
} from "./tools/read_slide.js";
import {
  exportSlideSchema,
  exportSlide,
} from "./tools/export_slide.js";
import {
  createPresentationSchema,
  createPresentation,
} from "./tools/create_presentation.js";
import {
  listThemesAndStylesSchema,
  listThemesAndStyles,
} from "./tools/list_themes_and_styles.js";

// Load version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
) as { version: string };

function buildMcpServer(version: string): McpServer {
  const server = new McpServer(
    {
      name: "marp-mcp",
      version: packageJson.version,
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    }
  );

  server.tool(
    "list_layouts",
    "List all available slide layouts with their required/optional parameters. " +
      "ALWAYS call this before manage_slide to discover valid layoutType values and their params. " +
      "Accepts optional 'theme' and 'style' params to override server defaults for this call only.",
    listLayoutsSchema.shape,
    listLayouts
  );

  server.tool(
    "generate_slide_ids",
    "Assign stable UUID slide IDs to every slide in a Marp file. " +
      "Run after creating initial slides so that future replace/delete/after/before operations can target specific slides by ID. " +
      "Safe to call multiple times — existing IDs are never changed.",
    generateSlideIdsSchema.shape,
    generateSlideIds
  );

  server.tool(
    "manage_slide",
    "Insert, replace, or delete slides in a Marp file using slide IDs. " +
      "Always call list_layouts first to see available layoutType values and their required params. " +
      "Use read_slide to get existing slide IDs before replace/delete/after/before operations. " +
      "Accepts optional 'theme' and 'style' params to override server defaults for this call only.",
    manageSlideSchema.shape,
    manageSlide
  );

  server.tool(
    "set_frontmatter",
    "Initialize or update required Marp frontmatter (marp:true, theme, header, paginate) and inject active style CSS. " +
      "Call this FIRST before adding slides to any new or existing presentation file. " +
      "Accepts optional 'theme' and 'style' params to override server defaults for this call only.",
    setFrontmatterSchema.shape,
    setFrontmatter
  );

  server.tool(
    "read_slide",
    "Read slide content from a Marp file. Returns a specific slide by ID, or all slides with their IDs and positions. " +
      "Use the returned slideId values with manage_slide for replace/delete/after/before operations.",
    readSlideSchema.shape,
    readSlide
  );

  server.tool(
    "export_slide",
    "Export a Marp markdown presentation to HTML, PDF, or PPTX using marp-cli. " +
      "HTML preserves all style rendering; PDF is printable; PPTX embeds slides as images (editable PPTX via pptxEditable flag requires LibreOffice). " +
      "Note: HTML export may not display local image files correctly — use PDF when local images are present. " +
      "Call set_frontmatter and ensure slides are complete before exporting.",
    exportSlideSchema.shape,
    exportSlide
  );

  server.tool(
    "list_themes_and_styles",
    "List all available themes and styles with descriptions and layout counts. " +
      "Shows current server defaults and explains how to override them per call. " +
      "Call this first when choosing a theme/style, then call list_layouts with your chosen theme/style params.",
    listThemesAndStylesSchema.shape,
    listThemesAndStyles
  );

  server.tool(
    "create_presentation",
    "Create a new Marp presentation file in one step — initializes frontmatter, adds a title slide, " +
      "and optionally adds content placeholder slides. " +
      "Use this to start a new presentation; use manage_slide to add/edit slides afterward.",
    createPresentationSchema.shape,
    createPresentation
  );

  return server;
}

const _tools = ["list_themes_and_styles", "list_layouts", "generate_slide_ids", "manage_slide", "set_frontmatter", "read_slide", "export_slide", "create_presentation"];

/**
 * Starts the MCP server on stdio transport.
 */
export async function startMcpServer(): Promise<void> {
  const server = buildMcpServer(packageJson.version);
  const transport = new StdioServerTransport();
  await server.connect(transport);

  info("Marp MCP Server running on stdio", {
    theme: getActiveTheme().name,
    style: getActiveStyle().name,
    version: packageJson.version,
    tools: _tools,
  });
}

/**
 * Starts the MCP server on streamable HTTP transport.
 * Each request gets its own transport instance (stateless sessions).
 */
export async function startMcpHttpServer(port: number): Promise<void> {
  const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", version: packageJson.version }));
      return;
    }

    if (req.url !== "/mcp") {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless
    });

    res.on("close", () => {
      transport.close().catch(() => {});
    });

    const server = buildMcpServer(packageJson.version);
    await server.connect(transport);
    await transport.handleRequest(req, res, await readBody(req));
  });

  httpServer.listen(port, () => {
    info("Marp MCP Server running on HTTP", {
      port,
      endpoint: `http://0.0.0.0:${port}/mcp`,
      health: `http://0.0.0.0:${port}/health`,
      theme: getActiveTheme().name,
      style: getActiveStyle().name,
      version: packageJson.version,
      tools: _tools,
    });
  });
}

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf-8");
      if (!raw) { resolve(undefined); return; }
      try { resolve(JSON.parse(raw)); } catch { resolve(undefined); }
    });
    req.on("error", reject);
  });
}
