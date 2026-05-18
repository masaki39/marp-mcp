/**
 * CJK character round-trip tests.
 * Verifies that Japanese / Chinese / Korean text passes through manage_slide
 * without any character corruption.
 */

import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { manageSlide } from "../manage_slide.js";
import { setActiveTheme } from "../../themes/index.js";

const FRONTMATTER = ["---", "marp: true", "theme: default", "---", ""].join("\n");

describe("CJK round-trip", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "marp-cjk-"));
    setActiveTheme("default");
  });

  afterEach(async () => {
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  it("preserves Japanese text in heading and list", async () => {
    const filePath = path.join(tempDir, "jp.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n`, "utf-8");

    const heading = "日本語タイトル：テスト用スライド";
    const items = ["最初の項目：概要", "二番目の項目：詳細", "三番目：まとめ"];

    await manageSlide({
      filePath,
      layoutType: "list",
      params: { heading, list: items },
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain(heading);
    items.forEach((item) => expect(content).toContain(item));
  });

  it("preserves Chinese text", async () => {
    const filePath = path.join(tempDir, "zh.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n`, "utf-8");

    const heading = "中文标题：测试幻灯片";
    const items = ["第一条：简介", "第二条：详情", "第三条：总结"];

    await manageSlide({
      filePath,
      layoutType: "list",
      params: { heading, list: items },
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain(heading);
    items.forEach((item) => expect(content).toContain(item));
  });

  it("preserves Korean text", async () => {
    const filePath = path.join(tempDir, "ko.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n`, "utf-8");

    const heading = "한국어 제목: 테스트 슬라이드";
    const items = ["첫 번째 항목: 개요", "두 번째 항목: 세부 내용"];

    await manageSlide({
      filePath,
      layoutType: "list",
      params: { heading, list: items },
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain(heading);
    items.forEach((item) => expect(content).toContain(item));
  });

  it("preserves CJK text in speaker notes", async () => {
    const filePath = path.join(tempDir, "note.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n`, "utf-8");

    const note = "スピーカーノート：重要なポイントを強調すること\n次のスライドへの遷移を説明する";

    await manageSlide({
      filePath,
      layoutType: "title",
      params: { heading: "Test" },
      note,
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain("スピーカーノート：重要なポイントを強調すること");
    expect(content).toContain("次のスライドへの遷移を説明する");
  });

  it("NFC normalized input is preserved correctly", async () => {
    const filePath = path.join(tempDir, "nfc.md");
    await fs.writeFile(filePath, `${FRONTMATTER}\n`, "utf-8");

    // NFC form of Japanese text (composed form)
    const nfcText = "日本語テスト".normalize("NFC");

    await manageSlide({
      filePath,
      layoutType: "title",
      params: { heading: nfcText },
    });

    const content = await fs.readFile(filePath, "utf-8");
    expect(content).toContain(nfcText);
  });
});
