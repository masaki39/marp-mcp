export interface SlideLayout {
  name: string;
  description: string;
  className?: string;
  params: {
    [key: string]: {
      type: "string" | "array" | "number";
      description: string;
      required: boolean;
      maxLength?: number;
      maxItems?: number;
      enum?: string[];
    };
  };
  template: (params: Record<string, unknown>) => string;
}

export type ThemeName = "default" | "gaia" | "uncover";

export interface ThemeDefinition {
  name: ThemeName;
  description: string;
  layouts: Record<string, SlideLayout>;
}

// Built-in style names. The runtime registry also accepts externally
// registered names discovered from marp-cli config (`themeSet`); those
// names cannot be enumerated statically, so `StyleDefinition.name` is
// widened to `string` and lookup APIs accept any string.
export type StyleName = "default" | "rich" | "minimal" | "dark" | "corporate" | "academic" | "tech";

export interface StyleDefinition {
  name: string;
  description: string;
  compatibleThemes: ThemeName[];
  css: string;
  layouts: Record<string, SlideLayout>;
}
