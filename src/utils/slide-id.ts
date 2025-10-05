/**
 * Slide ID utilities
 * Manages unique IDs for Marp slides using UUID v4
 */

import { randomUUID } from 'crypto';

const SLIDE_ID_REGEX = /<!--\s*slide-id:\s*([a-f0-9-]+)\s*-->/i;

/**
 * Generates a new unique slide ID using UUID v4
 */
export function generateSlideId(): string {
  return randomUUID();
}

/**
 * Extracts slide ID from slide content
 * Returns null if no ID is found
 */
export function extractSlideId(slideContent: string): string | null {
  const match = slideContent.match(SLIDE_ID_REGEX);
  return match ? match[1] : null;
}

/**
 * Adds slide ID to content if it doesn't have one
 * Returns the content with ID and the ID itself
 */
export function ensureSlideId(slideContent: string): { content: string; id: string } {
  const existingId = extractSlideId(slideContent);

  if (existingId) {
    return { content: slideContent, id: existingId };
  }

  const newId = generateSlideId();
  const trimmedContent = slideContent.trim();
  const contentWithId = `<!-- slide-id: ${newId} -->\n\n${trimmedContent}`;

  return { content: contentWithId, id: newId };
}

/**
 * Ensures all slides in an array have IDs
 * Returns updated slides and a map of slide IDs to their indices
 */
export function ensureAllSlideIds(slides: string[]): {
  slides: string[];
  idToIndex: Map<string, number>;
} {
  const updatedSlides: string[] = [];
  const idToIndex = new Map<string, number>();

  slides.forEach((slide, index) => {
    const { content, id } = ensureSlideId(slide);
    updatedSlides.push(content);
    idToIndex.set(id, index);
  });

  return { slides: updatedSlides, idToIndex };
}

/**
 * Finds slide index by ID
 * Returns -1 if not found
 */
export function findSlideIndexById(slides: string[], slideId: string): number {
  return slides.findIndex(slide => {
    const id = extractSlideId(slide);
    return id === slideId;
  });
}
