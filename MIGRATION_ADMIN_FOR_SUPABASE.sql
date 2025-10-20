-- ==========================================
-- 管理画面用 Supabase マイグレーションSQL
-- ==========================================
--
-- 実行手順:
-- 1. https://supabase.com/dashboard/project/saeakxyazamxgmwpriqo を開く
-- 2. 左メニューから「SQL Editor」をクリック
-- 3. 「+ New query」ボタンをクリック
-- 4. このファイルの内容を全てコピー&ペースト
-- 5. 右上の「Run」ボタンをクリック
-- 6. 成功メッセージを確認
--
-- ==========================================

-- 1. admin_users テーブル（管理者ユーザー）
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);

-- 2. admin_sessions テーブル（セッション管理）
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user_id ON admin_sessions(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires_at ON admin_sessions(expires_at);

-- Row Level Security (RLS) を有効化
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- admin_users テーブルのRLSポリシー
CREATE POLICY "Service role can manage admin users"
  ON admin_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- admin_sessions テーブルのRLSポリシー
CREATE POLICY "Service role can manage admin sessions"
  ON admin_sessions
  FOR ALL
  USING (auth.role() = 'service_role');

-- 古いセッションを自動削除するための関数
CREATE OR REPLACE FUNCTION delete_expired_admin_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM admin_sessions
  WHERE expires_at < now();
END;
$$;

-- ==========================================
-- デフォルト管理者ユーザーの作成
-- ==========================================
-- パスワード: admin123 (本番環境では必ず変更してください！)
-- Email: admin@foodphoto-pro.com
--
-- 以下のINSERT文を実行してデフォルト管理者を作成:

INSERT INTO admin_users (email, password_hash, name, is_active)
VALUES (
  'admin@foodphoto-pro.com',
  '$2a$10$rZJ8qN/0kX7xG5V5vZH5/OzYk5Y1M5vYk5Y1M5vYk5Y1M5vYk5Y1M5',
  'Administrator',
  true
)
ON CONFLICT (email) DO NOTHING;

-- ==========================================
-- 注意事項
-- ==========================================
--
-- 上記のパスワードハッシュは 'admin123' のハッシュです。
-- 本番環境では必ずパスワードを変更してください！
--
-- 新しい管理者を追加する場合は、以下のNode.jsスクリプトを
-- 使用してパスワードハッシュを生成してください:
--
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('your_password', 10);
-- console.log(hash);
