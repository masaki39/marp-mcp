# Marp MCP Server

MarpプレゼンテーションをAIで簡単に作成・編集できるMCPサーバーです。Claude Code、Cursor、Clineなどのツールで使用できます。

## 特徴

- 🎨 **カスタムテーマ対応** - 学術的なデザインのテーマを内蔵
- 📝 **7種類のレイアウト** - タイトル、セクション、コンテンツ、テーブル、画像など
- 🔧 **AI統合** - Claude CodeなどのMCP対応ツールで自然言語で操作
- 🖥️ **VS Code対応** - Marp for VS Code拡張機能で即座にプレビュー

## インストール

### npx経由（推奨）

```bash
npx @masaki39/marp-mcp
```

### グローバルインストール

```bash
npm install -g @masaki39/marp-mcp
```

## セットアップ

### Claude Code（CLI）で使う

プロジェクトまたはユーザースコープに追加:

```bash
# プロジェクトスコープ（.mcp.jsonに保存、共有可能）
claude mcp add marp npx -y @masaki39/marp-mcp

# ユーザースコープ（全プロジェクトで利用可能）
claude mcp add --scope user marp npx -y @masaki39/marp-mcp
```

### VS Codeでプレビュー

1. [Marp for VS Code](https://marketplace.visualstudio.com/items?itemName=marp-team.marp-vscode)拡張機能をインストール
2. プロジェクトフォルダを開く
3. `slides.md`を開いてプレビューボタンをクリック

## 使い方

### 1. プロジェクトの作成

AIに以下のように依頼:

```
"カレントディレクトリに'研究発表2024'というタイトルのプレゼンを作成して"
```

生成されるファイル構成:

```
current-directory/
├── slides.md              # メインファイル
├── custom_theme.css       # テーマ
├── .vscode/settings.json  # VS Code設定
├── attachments/           # 画像・データ
└── README.md
```

### 2. スライドの追加・編集

AIに自然言語で依頼:

```
"2枚目のスライドの後に、見出し'研究方法'の内容スライドを追加して"
```

```
"3枚目のスライドを削除して"
```

```
"右側に画像を表示するスライドを作成して"
```

### 3. PDFやHTMLに出力

Marp CLIをインストール:

```bash
npm install -g @marp-team/marp-cli
```

ビルド:

```bash
# PDF出力
marp slides.md -o slides.pdf

# HTML出力
marp slides.md -o slides.html

# PowerPoint出力
marp slides.md -o slides.pptx
```

## 利用可能なレイアウト

### section（セクション区切り）
- 中央揃えのタイトルとサブタイトル
- プレゼンの章立てに使用

### title（タイトルスライド）
- 左揃えのタイトル
- 発表者情報などを記載

### content（標準コンテンツ）
- 見出し（h2）とテキスト
- 最も頻繁に使用

### table（テーブル）
- 表形式のデータ表示
- サイズと配置を調整可能

### multi-column（マルチカラム）
- 2〜3カラムレイアウト
- 比較スライドなどに便利

### figure（背景画像付き）
- 背景に画像を配置
- 左右の配置とサイズを指定可能

### image（中央画像）
- 画像を中央に配置
- 高さと幅を調整可能

## ツール一覧

### init_presentation
新規プレゼンテーションを初期化

### manage_slide
スライドの挿入・置換・削除

### list_slide_layouts
利用可能なレイアウト一覧を表示

## テーマのカスタマイズ

`custom_theme.css`を編集して独自のデザインに変更できます:

- カラースキーム変更
- フォント変更
- レイアウト調整

## トラブルシューティング

### テンプレートが見つからない

ビルドを実行:

```bash
npm run build
ls build/templates/
```

以下のファイルがあることを確認:
- `custom_theme.css`
- `slides.template.md`
- `README.template.md`

## 開発

### ソースからビルド

```bash
git clone https://github.com/masaki39/marp-mcp.git
cd marp-mcp
npm install
npm run build
```

### ローカルテスト

```bash
npm link
```

その後、MCPクライアントでローカル版を使用するよう設定。

## ライセンス

MIT License

## クレジット

- テーマベース: [marp-theme-academic](https://github.com/kaisugi/marp-theme-academic) by kaisugi
- プロトコル: [Model Context Protocol](https://modelcontextprotocol.io)
- エンジン: [Marp](https://marp.app/)

## リンク

- [GitHub](https://github.com/masaki39/marp-mcp)
- [npm](https://www.npmjs.com/package/@masaki39/marp-mcp)
- [Marp公式](https://marpit.marp.app/)
- [MCP公式](https://modelcontextprotocol.io)
