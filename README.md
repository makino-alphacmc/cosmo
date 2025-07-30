# 🚀 CosmoMap - 宇宙地図アプリ

宇宙の天体を視覚的に探索できるインタラクティブな Web アプリケーションです。

## 🌟 機能

- 🪐 太陽系の主要な天体をインタラクティブに表示
- 🖱️ クリックで天体の詳細情報を表示
- 📱 レスポンシブデザイン（モバイル・タブレット・PC 対応）
- ✨ 美しいアニメーション効果
- 🎯 キーボード操作対応（ESC でモーダルを閉じる）

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **画像最適化**: Next.js Image
- **デプロイ**: Vercel

## 📦 インストール

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/cosmomap.git
cd cosmomap

# 依存関係のインストール
npm install
# または
yarn install
# または
pnpm install
```

## 🚀 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

## 📁 プロジェクト構造

```
cosmomap/
├── app/
│   ├── layout.tsx      # ルートレイアウト
│   ├── page.tsx        # メインページ
│   ├── globals.css     # グローバルスタイル
│   ├── error.tsx       # エラーバウンダリー
│   └── loading.tsx     # ローディング画面
├── components/
│   ├── SpaceMap.tsx    # メイン地図コンポーネント
│   ├── MapPin.tsx      # 天体ピンコンポーネント
│   └── CelestialModal.tsx # 詳細モーダル
├── data/
│   └── celestialBodies.json # 天体データ
├── types/
│   └── index.ts        # TypeScript型定義
├── public/
│   ├── space-bg.jpg    # 宇宙背景画像
│   └── planets/        # 天体画像
│       ├── sun.png
│       ├── earth.png
│       ├── moon.png
│       └── ...
└── package.json
```

## 🎨 必要な画像ファイル

`public`フォルダに以下の画像を配置してください：

### 背景画像

- `space-bg.jpg` - 宇宙の背景画像（推奨: 1920x1080px 以上）

### 天体画像（planets/フォルダ内）

- `sun.png` - 太陽
- `mercury.png` - 水星
- `venus.png` - 金星
- `earth.png` - 地球
- `moon.png` - 月
- `mars.png` - 火星
- `jupiter.png` - 木星
- `saturn.png` - 土星
- `uranus.png` - 天王星
- `neptune.png` - 海王星

**推奨**:

- 透過 PNG 形式
- 200x200px 程度
- NASA 等のパブリックドメイン画像を使用

## 🌐 デプロイ

### Vercel へのデプロイ

1. [Vercel](https://vercel.com)にサインアップ
2. GitHub リポジトリと連携
3. 自動デプロイの設定

```bash
# Vercel CLIを使用する場合
npm i -g vercel
vercel
```

## 🔧 カスタマイズ

### 天体の追加

`data/celestialBodies.json`に新しい天体を追加：

```json
{
	"id": "pluto",
	"name": "冥王星",
	"type": "planet",
	"position": { "top": "80%", "left": "95%" },
	"image": "/planets/pluto.png",
	"description": "かつて第9惑星とされていた準惑星。"
}
```

### スタイルの変更

`tailwind.config.js`でカスタムアニメーションやカラーを追加できます。

## 🚀 今後の拡張予定

- 🔍 検索機能
- 🏷️ カテゴリフィルター
- 🌍 多言語対応
- 📊 天体の詳細データ表示
- 🎮 3D ビュー機能

## 📝 ライセンス

MIT License

## 🤝 貢献

プルリクエストを歓迎します！

1. フォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. コミット (`git commit -m 'Add amazing feature'`)
4. プッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📧 お問い合わせ

質問や提案がありましたら、Issue を作成してください。

---

Made with ❤️ by CosmoMap Team
