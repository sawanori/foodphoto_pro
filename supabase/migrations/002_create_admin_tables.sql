-- 管理画面用のテーブル作成
-- Create admin tables

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
-- Service role only (no public access)
CREATE POLICY "Service role can manage admin users"
  ON admin_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- admin_sessions テーブルのRLSポリシー
-- Service role only (no public access)
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

-- Note: デフォルトの管理者ユーザーは別途作成する必要があります
-- パスワードハッシュは bcrypt で生成してください
--
-- 例: bcrypt.hash('your_password', 10) を使用して生成
--
-- INSERT INTO admin_users (email, password_hash, name) VALUES
-- ('admin@foodphoto-pro.com', '$2a$10$...', 'Administrator');
