/**
 * File path validation utilities
 */

import { resolve, normalize, isAbsolute } from "path";

/**
 * Validates a file path for security and correctness.
 *
 * @param filePath - The file path to validate
 * @param allowedExtensions - Array of allowed file extensions (e.g., ['.md'])
 * @returns Error message if validation fails, null if validation succeeds
 */
export function validateFilePath(
  filePath: string,
  allowedExtensions: string[] = [".md"]
): string | null {
  if (!isAbsolute(filePath)) {
    return "File path must be absolute";
  }

  // Reject paths with .. segments (traversal), but allow . segments
  const segments = filePath.split(/[/\\]/);
  if (segments.some(s => s === "..")) {
    return "File path contains path traversal sequences";
  }

  const resolved = resolve(normalize(filePath));

  if (allowedExtensions.length > 0) {
    const hasValidExtension = allowedExtensions.some((ext) =>
      resolved.endsWith(ext)
    );
    if (!hasValidExtension) {
      return `File must have one of these extensions: ${allowedExtensions.join(", ")}`;
    }
  }

  return null;
}
