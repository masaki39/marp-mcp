#!/usr/bin/env node

/**
 * Marp MCP - CLI and MCP Server for Marp presentation management
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { Command } from "commander";
import {
  getAvailableThemeNames,
  getTheme,
  setActiveTheme,
  getActiveTheme,
} from "./themes/index.js";
import {
  getAvailableStyleNames,
  getStyle,
  setActiveStyle,
} from "./styles/index.js";
import { error as logError } from "./utils/logger.js";
import { startMcpServer, startMcpHttpServer } from "./mcp.js";
import { registerCommands } from "./cli/commands.js";

// Load version from package.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8")
) as { version: string };

const program = new Command();

program
  .name("marp-mcp")
  .description("CLI and MCP Server for Marp presentation management")
  .version(packageJson.version)
  .option("-t, --theme <name>", "Theme name")
  .option("-s, --style <name>", "Style name");

// Validate theme/style before any command runs
program.hook("preAction", (_thisCommand, actionCommand) => {
  const opts = actionCommand.optsWithGlobals();

  if (opts.theme) {
    const theme = getTheme(opts.theme.toLowerCase());
    if (!theme) {
      logError(
        `Unknown theme "${opts.theme}". Available themes: ${getAvailableThemeNames().join(", ")}`,
        { themeArg: opts.theme, availableThemes: getAvailableThemeNames() }
      );
      process.exit(1);
    }
    setActiveTheme(theme.name);
  }

  if (opts.style) {
    const style = getStyle(opts.style.toLowerCase());
    if (!style) {
      logError(
        `Unknown style "${opts.style}". Available styles: ${getAvailableStyleNames().join(", ")}`,
        { styleArg: opts.style, availableStyles: getAvailableStyleNames() }
      );
      process.exit(1);
    }
    if (style.compatibleThemes.length > 0) {
      const currentTheme = getActiveTheme().name;
      if (!style.compatibleThemes.includes(currentTheme)) {
        logError(
          `Style "${style.name}" is not compatible with theme "${currentTheme}". Compatible themes: ${style.compatibleThemes.join(", ")}`,
          { style: style.name, currentTheme, compatibleThemes: style.compatibleThemes }
        );
        process.exit(1);
      }
    }
    setActiveStyle(style.name);
  }
});

// Default command: serve (MCP server)
program
  .command("serve", { isDefault: true })
  .description("Start MCP server on stdio (default) or HTTP when --port is set")
  .option("-p, --port <number>", "Start HTTP server on this port instead of stdio")
  .action(async (opts) => {
    if (opts.port) {
      const port = parseInt(opts.port, 10);
      if (isNaN(port) || port < 1 || port > 65535) {
        console.error(`Invalid port: ${opts.port}`);
        process.exit(1);
      }
      await startMcpHttpServer(port);
    } else {
      await startMcpServer();
    }
  });

// Register CLI subcommands
registerCommands(program);

program.parseAsync().catch((err) => {
  logError("Fatal error", {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });
  process.exit(1);
});
