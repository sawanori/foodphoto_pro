# foodphotopro セットアップガイド

## ✅ 完了した移行作業

以下の作業が完了しました：

1. ✅ 必要な依存関係を`package.json`に追加
2. ✅ `next.config.ts`に画像ホスト設定を追加
3. ✅ 共有コンポーネント・ライブラリをコピー (`src/components`, `src/lib`, `src/utils`)
4. ✅ ページファイルをコピー (`app/`)
5. ✅ APIルートをコピー (`app/api/foodphoto-order`)
6. ✅ パス調整とインポート修正
7. ✅ 環境変数設定ガイド作成 (`.env.example`)

## 🚀 次のステップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成し、実際の値を設定してください：

```bash
cp .env.example .env.local
```

必要な環境変数：
- **SendGrid**: メール送信に必要
- **Supabase**: データベース・認証に必要
- **Google Maps API**: 地図表示に必要
- **Google Tag Manager**: アナリティクス（オプション）
- **LINE Notify**: 通知機能（オプション）

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開いて確認してください。

### 4. ビルドテスト

本番環境へのデプロイ前に、ビルドが成功することを確認：

```bash
npm run build
```

## 📁 プロジェクト構造

```
foodphotopro/
├── app/                      # Next.js App Router
│   ├── page.tsx             # メインページ
│   ├── FoodPhotoClient.tsx  # クライアントコンポーネント
│   ├── metadata.ts          # SEOメタデータ
│   ├── structured-data.ts   # 構造化データ
│   ├── form/                # お問い合わせフォーム
│   ├── pricing/             # 料金ページ
│   ├── blog/                # ブログ
│   ├── area/[area]/         # エリア別ページ
│   └── api/                 # APIルート
│       └── foodphoto-order/ # フォーム送信API
├── src/
│   ├── components/          # 共有UIコンポーネント
│   ├── lib/                 # ライブラリ・スキーマ
│   └── utils/               # ユーティリティ関数
├── public/                  # 静的アセット
├── .env.example            # 環境変数テンプレート
└── package.json            # 依存関係

```

## 🔧 設定済み機能

### パフォーマンス最適化
- ✅ Critical CSS インライン化
- ✅ 画像プリロード
- ✅ Web Vitals 計測
- ✅ Static Generation (ISR: 1時間ごと再生成)

### SEO
- ✅ 構造化データ (LocalBusiness, FAQ, HowTo)
- ✅ メタデータ設定
- ✅ サイトマップ生成 (`next-sitemap`)
- ✅ パンくずリスト

### アクセシビリティ
- ✅ アクセシビリティエンハンサー
- ✅ スクリーンリーダー対応
- ✅ ARIA属性

### UI/UX
- ✅ Framer Motion アニメーション
- ✅ レスポンシブデザイン
- ✅ ローディング状態
- ✅ フォームバリデーション (Zod)

## ⚠️ 注意事項

### 画像URL
既存のVercel Blob Storageの画像URLをそのまま使用しています：
- `https://rpk6snz1bj3dcdnk.public.blob.vercel-storage.com/`

### ドメイン判定
既存の実装には `foodphoto-pro.com` のドメイン判定ロジックが含まれています。
本番環境では自動的にパスが調整されます。

### APIエンドポイント
フォーム送信は `/api/foodphoto-order` を使用します。
SendGridとSupabaseの設定が必要です。

## 🐛 トラブルシューティング

### ビルドエラーが発生する場合
1. 依存関係が正しくインストールされているか確認
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. 環境変数が設定されているか確認
   ```bash
   cat .env.local
   ```

### 画像が表示されない場合
- `next.config.ts` の `remotePatterns` 設定を確認
- Vercel Blob Storage のアクセス権限を確認

### フォーム送信が失敗する場合
- SendGrid APIキーが正しく設定されているか確認
- Supabase接続情報が正しいか確認

## 📦 デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリにプッシュ
2. Vercelで新規プロジェクトを作成
3. 環境変数を設定
4. デプロイ

```bash
git init
git add .
git commit -m "Initial commit: foodphotopro standalone app"
git remote add origin <your-repo-url>
git push -u origin main
```

## 📚 参考資料

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Zod Validation](https://zod.dev/)
- [SendGrid API](https://docs.sendgrid.com/)
- [Supabase Documentation](https://supabase.com/docs)

---

**移行完了！** 🎉

問題が発生した場合は、元のプロジェクト (`/practice/video-production-lp`) を参照してください。
