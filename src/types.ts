/**
 * Type definitions for Marp MCP Server
 */

export interface MarpFile {
  frontmatter: string;
  slides: string[];
}

export interface Slide {
  index: number;
  content: string;
}

export interface SlidePreview {
  index: number;
  preview: string;
}

export type LayoutType = "title" | "content" | "two-column" | "quote" | "image";

export interface LayoutParams {
  [key: string]: string | undefined;
}

export interface TitleLayoutParams extends LayoutParams {
  title: string;
  subtitle?: string;
}

export interface ContentLayoutParams extends LayoutParams {
  content: string;
  class?: string;
}

export interface TwoColumnLayoutParams extends LayoutParams {
  leftContent: string;
  rightContent: string;
  class?: string;
}

export interface QuoteLayoutParams extends LayoutParams {
  quote: string;
  author?: string;
}

export interface ImageLayoutParams extends LayoutParams {
  imageUrl: string;
  caption?: string;
  class?: string;
}

export interface LayoutDefinition<T extends LayoutParams = LayoutParams> {
  name: string;
  description: string;
  params: Record<keyof T, {
    type: "string";
    description: string;
    required: boolean;
    maxLength?: number;
  }>;
  template: (params: T) => string;
}

export interface ToolResponse {
  [x: string]: unknown;
  content: Array<{
    type: "text";
    text: string;
  }>;
}
