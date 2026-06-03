/**
 * Discover external Marp styles from a marp-cli compatible configuration.
 *
 * marp-cli resolves its configuration via cosmiconfig under module name
 * `marp` (see https://github.com/marp-team/marp-cli/blob/main/docs/configuration.md).
 * We reuse the same mechanism so any CSS theme listed under the resolved
 * config's `themeSet` field is registered as a runtime MCP style.
 *
 * Each CSS file's `/* @theme NAME *​/` directive (matched with the same
 * regex Marpit uses) becomes the style name. External styles inherit the
 * default style's (empty) layout map so all existing tools keep working
 * — layouts continue to come from the active theme.
 *
 * Every IO/parse error is caught and logged; discovery must never throw.
 */

import { promises as fs } from "fs";
import { dirname, extname, isAbsolute, resolve } from "path";
import { cosmiconfig } from "cosmiconfig";
import { registerExternalStyle } from "../styles/index.js";
import { warn, info } from "./logger.js";
import type { StyleDefinition } from "../themes/types.js";

const MODULE_NAME = "marp";

// Marpit's @theme directive regex, matching marp-team/marpit's theme parser.
const THEME_DIRECTIVE = /\/\*[\s\S]*?@theme\s+([^\s*]+)[\s\S]*?\*\//;

interface DiscoveryResult {
  registered: string[];
  configPath: string | null;
}

export async function discoverExternalStyles(
  cwd: string = process.cwd()
): Promise<DiscoveryResult> {
  const result: DiscoveryResult = { registered: [], configPath: null };

  let configResult: { config: unknown; filepath: string } | null = null;
  try {
    const explorer = cosmiconfig(MODULE_NAME);
    configResult = await explorer.search(cwd);
  } catch (err) {
    warn("Failed to load marp configuration; skipping external styles", {
      cwd,
      error: err instanceof Error ? err.message : String(err),
    });
    return result;
  }

  if (!configResult) return result;
  result.configPath = configResult.filepath;

  const themeSet = extractThemeSet(configResult.config);
  if (themeSet.length === 0) return result;

  const baseDir = dirname(configResult.filepath);
  const cssPaths = await collectCssPaths(themeSet, baseDir);

  for (const cssPath of cssPaths) {
    const def = await loadStyleFromCss(cssPath);
    if (!def) continue;
    if (registerExternalStyle(def, cssPath)) {
      result.registered.push(def.name);
    }
  }

  if (result.registered.length > 0) {
    info("Registered external Marp styles from themeSet", {
      configPath: configResult.filepath,
      styles: result.registered,
    });
  }

  return result;
}

function extractThemeSet(config: unknown): string[] {
  if (!config || typeof config !== "object") return [];
  const value = (config as Record<string, unknown>).themeSet;
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string");
  }
  return [];
}

async function collectCssPaths(
  themeSet: string[],
  baseDir: string
): Promise<string[]> {
  const out: string[] = [];

  for (const entry of themeSet) {
    const absolute = isAbsolute(entry) ? entry : resolve(baseDir, entry);
    let stat;
    try {
      stat = await fs.stat(absolute);
    } catch (err) {
      warn("themeSet entry does not exist on disk; skipping", {
        path: absolute,
        error: err instanceof Error ? err.message : String(err),
      });
      continue;
    }

    if (stat.isDirectory()) {
      try {
        const entries = await fs.readdir(absolute);
        for (const name of entries) {
          if (extname(name).toLowerCase() === ".css") {
            out.push(resolve(absolute, name));
          }
        }
      } catch (err) {
        warn("Failed to read themeSet directory; skipping", {
          path: absolute,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    } else if (stat.isFile()) {
      if (extname(absolute).toLowerCase() === ".css") {
        out.push(absolute);
      } else {
        warn("themeSet entry is not a .css file; skipping", { path: absolute });
      }
    }
  }

  return out;
}

async function loadStyleFromCss(
  cssPath: string
): Promise<StyleDefinition | null> {
  let css: string;
  try {
    css = await fs.readFile(cssPath, "utf-8");
  } catch (err) {
    warn("Failed to read external style CSS; skipping", {
      path: cssPath,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }

  const match = css.match(THEME_DIRECTIVE);
  if (!match) {
    warn(
      "CSS file does not declare a /* @theme NAME */ directive; skipping",
      { path: cssPath }
    );
    return null;
  }

  // Normalise to lowercase so CLI input (which lowercases `-s <name>`)
  // can match external names regardless of the casing used in the @theme
  // directive.
  const name = match[1].toLowerCase();

  return {
    name,
    description: `External style discovered from ${cssPath}`,
    compatibleThemes: [],
    css,
    layouts: {},
  };
}
