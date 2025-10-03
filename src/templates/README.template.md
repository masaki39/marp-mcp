# {{PRESENTATION_TITLE}}

{{PRESENTATION_DESCRIPTION}}

## ディレクトリ構造

```
.
├── slides.md              # メインスライド
├── themes/
│   └── academic_custom.css  # カスタムテーマ
├── attachments/
│   ├── images/           # 画像ファイル
│   ├── videos/           # 動画ファイル
│   └── data/             # データファイル
└── README.md             # このファイル
```

## ビルド方法

### PDF出力
\`\`\`bash
marp slides.md -o slides.pdf
\`\`\`

### HTML出力
\`\`\`bash
marp slides.md -o slides.html
\`\`\`

### プレビュー（VSCode拡張）
Marp for VS Code拡張をインストールして、`slides.md`を開くとプレビューが表示されます。

## テーマについて

このプロジェクトでは`academic_custom`テーマを使用しています。

### 利用可能なクラス

- `.title` - タイトルスライド（中央揃え）
- `.lead` - リードスライド（左揃え、マルーン色）
- `.table-center` - テーブル中央揃え
- `.table-100` - テーブル幅100%
- `.table-tiny/small/large` - テーブルサイズ調整

### マルチカラムの使い方

二重blockquote記法を使用します：

\`\`\`markdown
> > 左カラムの内容
> > - リスト1
>
> > 右カラムの内容
> > - リスト2
\`\`\`

## アセットの配置

- 画像: `attachments/images/`
- 動画: `attachments/videos/`
- データ: `attachments/data/`

画像の参照例：
\`\`\`markdown
![説明](./attachments/images/example.png)
\`\`\`
