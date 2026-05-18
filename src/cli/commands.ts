/**
 * CLI subcommand definitions
 */

import type { Command } from "commander";
import { resolveFilePath, outputResult } from "./helpers.js";
import { listLayouts } from "../tools/list_layouts.js";
import { generateSlideIds } from "../tools/generate_slide_ids.js";
import { manageSlide } from "../tools/manage_slide.js";
import { setFrontmatter } from "../tools/set_frontmatter.js";
import { readSlide } from "../tools/read_slide.js";
import { exportSlide } from "../tools/export_slide.js";
import { createPresentation } from "../tools/create_presentation.js";
import { listThemesAndStyles } from "../tools/list_themes_and_styles.js";
import { generateAgenda } from "../tools/generate_agenda.js";
import { addImageTransition } from "../tools/add_image_transition.js";
import { batchManageSlides } from "../tools/batch_manage_slides.js";

/**
 * Registers all CLI subcommands on the given commander program.
 */
export function registerCommands(program: Command): void {
  program
    .command("list-themes-and-styles")
    .description("List all available themes and styles with descriptions and layout counts")
    .action(async () => {
      const result = await listThemesAndStyles();
      outputResult(result);
    });

  program
    .command("list-layouts")
    .description("List all available slide layouts (JSON output)")
    .action(async () => {
      const result = await listLayouts({});
      outputResult(result);
    });

  program
    .command("generate-ids <file>")
    .description("Assign slide IDs to every slide in a Marp markdown file")
    .action(async (file: string) => {
      const result = await generateSlideIds({
        filePath: resolveFilePath(file),
      });
      outputResult(result);
    });

  program
    .command("manage <file>")
    .description("Insert, replace, or delete slides in a Marp file")
    .requiredOption("-l, --layout <type>", "Layout type (e.g. title, content)")
    .option("-p, --params <json>", "Parameters as JSON string", "{}")
    .option("-m, --mode <mode>", "Operation mode: insert | replace | delete", "insert")
    .option("--position <pos>", "Position: end | start | after | before", "end")
    .option("--slide-id <id>", "Target slide ID")
    .option("--note <text>", "Speaker notes")
    .action(async (file: string, opts: {
      layout: string;
      params: string;
      mode: string;
      position: string;
      slideId?: string;
      note?: string;
    }) => {
      let params: Record<string, any>;
      try {
        params = JSON.parse(opts.params);
      } catch {
        process.stderr.write("Error: --params must be valid JSON\n");
        process.exit(1);
      }

      const result = await manageSlide({
        filePath: resolveFilePath(file),
        layoutType: opts.layout,
        params,
        mode: opts.mode as "insert" | "replace" | "delete",
        position: opts.position as "end" | "start" | "after" | "before",
        slideId: opts.slideId,
        note: opts.note,
      });
      outputResult(result);
    });

  program
    .command("set-frontmatter <file>")
    .description("Add or update Marp frontmatter fields")
    .option("--header <text>", "Header text")
    .option("--paginate", "Enable pagination")
    .option("--no-paginate", "Disable pagination")
    .action(async (file: string, opts: {
      header?: string;
      paginate?: boolean;
    }) => {
      const result = await setFrontmatter({
        filePath: resolveFilePath(file),
        header: opts.header,
        paginate: opts.paginate,
      });
      outputResult(result);
    });

  program
    .command("read <file>")
    .description("Read slide content from a Marp file")
    .option("--slide-id <id>", "Read a specific slide by ID")
    .action(async (file: string, opts: {
      slideId?: string;
    }) => {
      const result = await readSlide({
        filePath: resolveFilePath(file),
        slideId: opts.slideId,
      });
      outputResult(result);
    });

  program
    .command("export <file>")
    .description("Export a Marp markdown file to HTML or PDF")
    .requiredOption("-f, --format <format>", "Output format: html | pdf")
    .option("-o, --output <path>", "Output file path (default: same dir as input)")
    .option("--allow-local-files", "Allow local file access in HTML export")
    .option("--theme-set <path>", "Path to custom theme CSS file")
    .action(async (file: string, opts: {
      format: string;
      output?: string;
      allowLocalFiles?: boolean;
      themeSet?: string;
    }) => {
      const result = await exportSlide({
        filePath: resolveFilePath(file),
        format: opts.format as "html" | "pdf",
        outputPath: opts.output ? resolveFilePath(opts.output) : undefined,
        allowLocalFiles: opts.allowLocalFiles,
        themeSet: opts.themeSet,
      });
      outputResult(result);
    });

  program
    .command("generate-agenda <file>")
    .description("Auto-generate an agenda slide from section slides")
    .option("--section-class <class>", "CSS class of section slides", "acad-section")
    .option("--heading <text>", "Agenda slide heading", "Agenda")
    .action(async (file: string, opts: { sectionClass: string; heading: string }) => {
      const result = await generateAgenda({
        filePath: resolveFilePath(file),
        sectionClass: opts.sectionClass,
        agendaHeading: opts.heading,
      });
      outputResult(result);
    });

  program
    .command("add-image-transition <file>")
    .description("Insert a full-screen background image slide before the target slide")
    .requiredOption("--slide-id <id>", "Target slide ID")
    .requiredOption("--image-url <url>", "Image URL or path for the background slide")
    .action(async (file: string, opts: { slideId: string; imageUrl: string }) => {
      const result = await addImageTransition({
        filePath: resolveFilePath(file),
        slideId: opts.slideId,
        imageUrl: opts.imageUrl,
      });
      outputResult(result);
    });

  program
    .command("batch <file>")
    .description("Apply multiple slide operations from a JSON file")
    .requiredOption("--ops <json>", "Operations array as JSON string")
    .option("--theme <name>", "Theme name override")
    .option("--style <name>", "Style name override")
    .action(async (file: string, opts: { ops: string; theme?: string; style?: string }) => {
      let operations: unknown[];
      try {
        operations = JSON.parse(opts.ops);
      } catch {
        process.stderr.write("Error: --ops must be valid JSON array\n");
        process.exit(1);
      }
      const result = await batchManageSlides({
        filePath: resolveFilePath(file),
        operations: operations as Parameters<typeof batchManageSlides>[0]["operations"],
        theme: opts.theme,
        style: opts.style,
      });
      outputResult(result);
    });

  program
    .command("create <file>")
    .description("Create a new Marp presentation with frontmatter and title slide")
    .requiredOption("--title <text>", "Presentation title")
    .option("--subtitle <text>", "Optional subtitle for the title slide")
    .option("--no-paginate", "Disable slide page numbers")
    .option("--slides <n>", "Number of blank content placeholder slides to add", "0")
    .action(async (file: string, opts: {
      title: string;
      subtitle?: string;
      paginate?: boolean;
      slides: string;
    }) => {
      const result = await createPresentation({
        filePath: resolveFilePath(file),
        title: opts.title,
        subtitle: opts.subtitle,
        paginate: opts.paginate !== false,
        slideCount: parseInt(opts.slides, 10) || 0,
      });
      outputResult(result);
    });
}
