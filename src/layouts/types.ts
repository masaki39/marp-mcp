/**
 * Type definitions for slide layouts
 */

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
    };
  };
  template: (params: any) => string;
}
