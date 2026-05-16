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

export type StyleName = "default" | "rich" | "minimal" | "dark" | "corporate" | "academic" | "tech";

export interface StyleDefinition {
  name: StyleName;
  description: string;
  compatibleThemes: ThemeName[];
  css: string;
  layouts: Record<string, SlideLayout>;
}
