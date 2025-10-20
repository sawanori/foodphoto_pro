# Supabase データベースセットアップ手順

このガイドでは、チャットシステムに必要なSupabaseデータベースのセットアップ方法を説明します。

## 前提条件

- Supabaseプロジェクトが作成済み
- プロジェクトURL: `https://saeakxyazamxgmwpriqo.supabase.co`
- APIキーが設定済み（`.env.local`に記載）

## セットアップ手順

### 1. Supabaseダッシュボードにアクセス

1. ブラウザで以下のURLを開く:
   ```
   https://supabase.com/dashboard/project/saeakxyazamxgmwpriqo
   ```

2. 左側のメニューから **「SQL Editor」** をクリック

### 2. マイグレーションSQLの実行

1. 「New query」ボタンをクリックして新しいクエリを作成

2. `/supabase/migrations/001_create_chat_tables.sql` ファイルの内容を全てコピー

3. SQL Editorにペースト

4. 右上の **「Run」** ボタンをクリックして実行

5. 成功メッセージが表示されることを確認

### 3. テーブルの確認

1. 左側のメニューから **「Table Editor」** をクリック

2. 以下の3つのテーブルが作成されていることを確認:
   - `conversations` - チャット会話の管理
   - `messages` - メッセージの保存
   - `profiles` - 管理者/スタッフ情報

### 4. 環境変数の確認

`.env.local` ファイルで以下の設定を確認:

```bash
# Supabase (データベース・認証)
NEXT_PUBLIC_SUPABASE_URL=https://saeakxyazamxgmwpriqo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sbp_3d6b4e8a8ab89b2b535b68374bcaea30e9a302e5

# チャット機能
NEXT_PUBLIC_USE_MOCK=true  # falseに変更すると実際のSupabaseを使用
```

### 5. チャットシステムの有効化

実際のSupabaseデータベースを使用する場合:

1. `.env.local` を開く
2. `NEXT_PUBLIC_USE_MOCK=false` に変更
3. 開発サーバーを再起動:
   ```bash
   npm run dev
   ```

## データベーススキーマ詳細

### conversations テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー（自動生成） |
| channel | TEXT | 'web' または 'line' |
| status | TEXT | 'new', 'active', 'snoozed', 'closed' |
| contact_name | TEXT | 連絡者名（任意） |
| contact_email | TEXT | 連絡者メール（任意） |
| line_user_id | TEXT | LINE連携用（任意） |
| session_token | TEXT | セッション識別子 |
| assigned_to | UUID | 担当者（任意） |
| created_at | TIMESTAMPTZ | 作成日時（自動） |
| last_message_at | TIMESTAMPTZ | 最終メッセージ日時 |

### messages テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー（自動生成） |
| conversation_id | UUID | 会話ID（外部キー） |
| role | TEXT | 'user', 'agent', 'system' |
| source | TEXT | 'web', 'admin', 'line' |
| content | TEXT | メッセージ本文 |
| content_type | TEXT | 'text/plain'（デフォルト） |
| attachment_url | TEXT | 添付ファイルURL（任意） |
| created_by | UUID | 作成者（任意） |
| created_at | TIMESTAMPTZ | 作成日時（自動） |
| delivered_to_line | BOOLEAN | LINE配信済みフラグ |

### profiles テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| user_id | UUID | ユーザーID（主キー） |
| role | TEXT | 'admin' または 'staff' |
| created_at | TIMESTAMPTZ | 作成日時（自動） |

## セキュリティ設定 (RLS)

Row Level Security (RLS) が有効化されており、以下のポリシーが適用されています:

- **ゲストユーザー**: 会話の作成とメッセージの送信が可能
- **認証済みユーザー**: 全ての会話とメッセージの閲覧・管理が可能
- **管理者**: プロフィールの管理が可能

## トラブルシューティング

### エラー: "relation does not exist"

- マイグレーションSQLが正しく実行されていない可能性があります
- SQL Editorで再度実行してください

### エラー: "permission denied"

- RLSポリシーが正しく設定されていない可能性があります
- マイグレーションSQLを全て実行したことを確認してください

### チャットが動作しない

1. `.env.local`のSupabase URLとAPIキーを確認
2. `NEXT_PUBLIC_USE_MOCK`が`false`になっているか確認
3. 開発サーバーを再起動

## 次のステップ

1. チャット機能をテストする
2. 管理画面で会話履歴を確認する
3. 必要に応じてRLSポリシーをカスタマイズする
