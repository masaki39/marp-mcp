import { defaultStyle } from "./default/index.js";
import { richStyle } from "./rich/index.js";
import { minimalStyle } from "./minimal/index.js";
import { darkStyle } from "./dark/index.js";
import { corporateStyle } from "./corporate/index.js";
import { academicStyle } from "./academic/index.js";
import { techStyle } from "./tech/index.js";
import { warn } from "../utils/logger.js";
import type { StyleDefinition, StyleName } from "../themes/types.js";

const builtinStyles: Record<StyleName, StyleDefinition> = {
  default: defaultStyle,
  rich: richStyle,
  minimal: minimalStyle,
  dark: darkStyle,
  corporate: corporateStyle,
  academic: academicStyle,
  tech: techStyle,
};

interface ExternalStyleEntry {
  def: StyleDefinition;
  source: string;
}

const externalStyles = new Map<string, ExternalStyleEntry>();

let activeStyle: StyleDefinition = defaultStyle;

export function getActiveStyle(): StyleDefinition {
  return activeStyle;
}

export function setActiveStyle(styleName: string): void {
  const style = getStyle(styleName);
  if (!style) {
    throw new Error(`Unknown style "${styleName}"`);
  }
  activeStyle = style;
}

export function getStyle(styleName: string): StyleDefinition | undefined {
  const external = externalStyles.get(styleName);
  if (external) return external.def;
  return builtinStyles[styleName as StyleName];
}

export function getAvailableStyleNames(): string[] {
  return [...Object.keys(builtinStyles), ...externalStyles.keys()];
}

/**
 * Register a style discovered outside the built-in registry (e.g. via the
 * marp-cli `themeSet` configuration). Collisions with built-in names are
 * rejected; collisions between externals replace the previous entry.
 */
export function registerExternalStyle(
  def: StyleDefinition,
  source: string
): boolean {
  if (Object.prototype.hasOwnProperty.call(builtinStyles, def.name)) {
    warn(
      `External style "${def.name}" collides with a built-in style; skipping.`,
      { source }
    );
    return false;
  }
  if (externalStyles.has(def.name)) {
    warn(
      `External style "${def.name}" already registered; replacing previous entry.`,
      { previousSource: externalStyles.get(def.name)?.source, source }
    );
  }
  externalStyles.set(def.name, { def, source });
  return true;
}

export function getExternalStyles(): ExternalStyleEntry[] {
  return Array.from(externalStyles.values());
}

/** Test-only: clear all externally registered styles. */
export function clearExternalStyles(): void {
  externalStyles.clear();
}

export { builtinStyles as styles };
