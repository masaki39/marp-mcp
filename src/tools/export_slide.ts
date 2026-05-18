/**
 * Tool: export_slide
 * Exports a Marp markdown presentation to HTML, PDF, or PPTX using marp-cli.
 */

import { z } from "zod";
import { spawn } from "child_process";
import { promises as fs } from "fs";
import { validateFilePath } from "../utils/path-validator.js";
import { createErrorResponse, createSuccessResponse } from "../utils/response.js";
import type { ToolResponse } from "../types/common.js";

export const exportSlideSchema = z.object({
  filePath: z.string().describe("Absolute path to the Marp markdown file to export (must end in .md)"),
  format: z
    .enum(["html", "pdf", "pptx"])
    .describe(
      "Output format: 'html' for browser-viewable presentation with full style rendering, " +
        "'pdf' for printable document, 'pptx' for PowerPoint-compatible file (slide images embedded)"
    ),
  outputPath: z
    .string()
    .optional()
    .describe(
      "Absolute path for the output file (e.g. /tmp/presentation.html). " +
        "If omitted, output is placed next to the input file with the matching extension."
    ),
  allowLocalFiles: z
    .boolean()
    .optional()
    .describe(
      "Allow local file access in HTML export (enables local images). Defaults to false for security. " +
        "Set true only when images are referenced by local file paths."
    ),
  themeSet: z
    .string()
    .optional()
    .describe(
      "Absolute path to a custom theme CSS file to include. " +
        "Omit when using built-in themes (default, gaia, uncover)."
    ),
  pptxEditable: z
    .boolean()
    .optional()
    .describe(
      "[EXPERIMENTAL] Generate an editable PPTX with actual text and shapes instead of pre-rendered images. " +
        "Requires LibreOffice to be installed. May have lower slide reproducibility and does not support presenter notes. " +
        "Only valid when format is 'pptx'."
    ),
});

function getMarpBinPath(): string {
  return "marp";
}

/**
 * Runs a command and resolves with { exitCode, stdout, stderr }.
 */
function runCommand(
  command: string,
  args: string[],
  timeoutMs: number
): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      proc.kill("SIGTERM");
    }, timeoutMs);

    proc.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    proc.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });

    proc.on("close", (code) => {
      clearTimeout(timer);
      if (timedOut) {
        resolve({ exitCode: -1, stdout, stderr: `Command timed out after ${timeoutMs / 1000} seconds` });
      } else {
        resolve({ exitCode: code ?? 1, stdout, stderr });
      }
    });

    proc.on("error", (err) => {
      clearTimeout(timer);
      const msg = (err as NodeJS.ErrnoException).code === "ENOENT"
        ? "marp command not found. Install with: npm install -g @marp-team/marp-cli"
        : err.message;
      resolve({ exitCode: -1, stdout: "", stderr: msg });
    });
  });
}

/**
 * Detects local image paths in markdown content (non-http/https references).
 */
function detectLocalImagePaths(content: string): string[] {
  const matches: string[] = [];
  const regex = /!\[.*?\]\(([^)]+)\)/g;
  let m;
  while ((m = regex.exec(content)) !== null) {
    const src = m[1].split(" ")[0]; // strip optional title attribute
    if (!src.startsWith("http://") && !src.startsWith("https://")) {
      matches.push(src);
    }
  }
  return matches;
}

/**
 * MCP Tool: Exports a Marp markdown presentation to HTML, PDF, or PPTX.
 *
 * @param {object} options - Export options
 * @param {string} options.filePath - Absolute path to the Marp markdown file
 * @param {"html" | "pdf" | "pptx"} options.format - Output format
 * @param {string} [options.outputPath] - Output file path (default: same dir as input)
 * @param {boolean} [options.allowLocalFiles] - Allow local file access in HTML export
 * @param {string} [options.themeSet] - Path to custom theme CSS file
 * @param {boolean} [options.pptxEditable] - Generate editable PPTX (requires LibreOffice)
 * @returns {Promise<ToolResponse>} Export result with output file path
 */
export async function exportSlide({
  filePath,
  format,
  outputPath,
  allowLocalFiles,
  themeSet,
  pptxEditable,
}: z.infer<typeof exportSlideSchema>): Promise<ToolResponse> {
  // Validate input file path
  const pathError = validateFilePath(filePath);
  if (pathError) {
    return createErrorResponse(pathError);
  }

  // Validate themeSet path if provided
  if (themeSet) {
    const themeError = validateFilePath(themeSet, [".css"]);
    if (themeError) {
      return createErrorResponse(`Invalid themeSet path: ${themeError}`);
    }
  }

  // Validate outputPath if provided
  if (outputPath) {
    const outputError = validateFilePath(outputPath, [".html", ".pdf", ".pptx"]);
    if (outputError) {
      return createErrorResponse(`Invalid outputPath: ${outputError}`);
    }
  }

  // pptxEditable is only valid for pptx format
  if (pptxEditable && format !== "pptx") {
    return createErrorResponse("pptxEditable is only valid when format is 'pptx'.");
  }

  // Check that the input file exists and read content
  let content: string;
  try {
    content = await fs.readFile(filePath, "utf-8");
  } catch {
    return createErrorResponse(
      `File not found: ${filePath}. Ensure the file exists before exporting.`
    );
  }

  // Detect local image paths for HTML warning
  let localImageWarning: string | undefined;
  if (format === "html") {
    const localPaths = detectLocalImagePaths(content);
    if (localPaths.length > 0) {
      localImageWarning =
        `Local image paths detected: [${localPaths.join(", ")}]. ` +
        "HTML export may not display these correctly. Consider using PDF format instead, " +
        "or set allowLocalFiles: true if you need HTML with local images.";
    }
  }

  // Determine output path
  const resolvedOutput = outputPath ?? filePath.replace(/\.md$/, `.${format}`);

  // Build marp CLI args
  const args: string[] = [
    "--no-config-file",
    "--html",                          // always enable --html for style class rendering
    "--output", resolvedOutput,
  ];

  if (format === "pdf") {
    args.push("--pdf");
  } else if (format === "pptx") {
    args.push("--pptx");
    if (pptxEditable) {
      args.push("--pptx-editable");
    }
  }

  if (allowLocalFiles) {
    args.push("--allow-local-files");
  }

  if (themeSet) {
    args.push("--theme-set", themeSet);
  }

  args.push(filePath);

  const { exitCode, stderr } = await runCommand(getMarpBinPath(), args, 60_000);

  if (exitCode !== 0) {
    const errorMessage = stderr.trim() || `marp CLI exited with code ${exitCode}`;
    return createErrorResponse(`Export failed: ${errorMessage}`);
  }

  const formatLabel = format === "pptx" && pptxEditable ? "PPTX (editable)" : format.toUpperCase();

  return createSuccessResponse({
    message: `Exported successfully to ${formatLabel}`,
    outputPath: resolvedOutput,
    format,
    sourceFile: filePath,
    ...(localImageWarning ? { warning: localImageWarning } : {}),
  });
}
