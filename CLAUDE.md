# CLAUDE.md — 開発エッセンス

## ドキュメント自動生成（最重要）

- `README.md`、`skills/marp/SKILL.md`、`assets/examples/md/` はすべて Jest テスト内で自動生成される
- **`pnpm test` を実行すると上書きされる**ため、内容を変えたい場合は対応する generator テストを修正する
  - README → `src/__tests__/readme-generator.test.ts`
  - SKILL.md → `src/__tests__/skill-generator.test.ts`
  - Examples → `src/styles/__tests__/example-generator.test.ts`、`src/themes/__tests__/example-generator.test.ts`
- `.claude/skills/marp/SKILL.md` は `skills/marp/SKILL.md` へのシンボリックリンク
- generator テストも `pnpm test` に含まれるため、テスト実行 = ドキュメント再生成

## ESM + TypeScript

- `"type": "module"` プロジェクト。import は必ず `.js` 拡張子をつける（`import { foo } from "./bar.js"`）
- ビルド: `tsc` → `build/` に出力

## ツール追加パターン

- `src/tools/{name}.ts` に Zod スキーマ + async ハンドラ
- `src/mcp.ts` で `server.tool(name, description, schema.shape, handler)` — `.shape` を渡すこと
- `src/cli/commands.ts` に CLI サブコマンド追加
- レスポンスは `createErrorResponse()` / `createSuccessResponse()`（`src/utils/response.ts`）を使う

## テーマ・スタイル追加パターン

- テーマ: `src/themes/{name}/index.ts` で `ThemeDefinition` をエクスポート → `src/themes/index.ts` の `themes` に登録
- スタイル: `src/styles/{name}/index.ts` + `css.ts` → `src/styles/index.ts` の `styles` に登録
- スタイルのレイアウトは同名のテーマレイアウトをオーバーライドする
- 追加後は generator テストのサンプルパラメータも追加すること

## スライド分割

- `splitSlides()`（`src/utils/frontmatter.ts`）を必ず使う。正規表現を直接書かないこと

## Marp 画像モーフィング（CSS View Transitions）

- `![bg contain](url)` は CSS `background-image` になるため DOM の `<img>` がなく `view-transition-name` が効かない
- フルスクリーン画像は `<!-- _class: img-fullscreen -->` + inline `![morphName](url)` パターンを使う
- alt の非キーワード語はそのまま HTML `alt` 属性になる → `img[alt~="name"]` で両スライドをターゲットできる

## テスト規約

- 一時ディレクトリ: `fs.mkdtemp(path.join(os.tmpdir(), "marp-{prefix}-"))`
- `beforeEach` で `setActiveTheme("default")` を呼んでテーマ状態リセット

## パッケージ管理 (pnpm)

- パッケージマネージャーは pnpm（`pnpm install` でロックファイル `pnpm-lock.yaml` を更新）
- `npm publish` / `npm version` は pnpm プロジェクトでもそのまま動作する
- `"files"`: `build`, `.claude/skills`, `README.md`, `LICENSE` のみ公開

## リリースフロー

1. `changelog/{version}.md` を作成してリリースノートを書く
2. `npm version {version}` でバージョンバンプ＋タグ作成
3. `git push && git push --tags` でプッシュ → GitHub Actions が自動で GitHub Release を作成
4. `npm publish` で npm に手動公開

## CI

- テスト: Node 18.x / 20.x / 22.x（pnpm でインストール）
- examples の HTML は CI で GitHub Pages にデプロイ（`assets/examples/html/` は `.gitignore` 対象）
- タグ push（`v*`）で GitHub Release を自動作成（`changelog/{version}.md` がリリースノート）
- changelog は `--notes-file` でそのまま渡す設計のため、内容に制限なし（backtick 等も問題なし）
