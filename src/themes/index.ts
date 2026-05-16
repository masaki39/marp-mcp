import { defaultTheme } from "./default/index.js";
import { gaiaTheme } from "./gaia/index.js";
import { uncoverTheme } from "./uncover/index.js";
import type { ThemeDefinition, ThemeName } from "./types.js";

const themes = {
  default: defaultTheme,
  gaia: gaiaTheme,
  uncover: uncoverTheme,
} satisfies Record<ThemeName, ThemeDefinition>;

let activeTheme: ThemeDefinition = defaultTheme;

export function getActiveTheme(): ThemeDefinition {
  return activeTheme;
}

export function setActiveTheme(themeName: ThemeName): void {
  activeTheme = themes[themeName];
}

export function getTheme(themeName: string): ThemeDefinition | undefined {
  return themes[themeName as ThemeName];
}

export function getAvailableThemeNames(): ThemeName[] {
  return Object.keys(themes) as ThemeName[];
}

export { themes };
