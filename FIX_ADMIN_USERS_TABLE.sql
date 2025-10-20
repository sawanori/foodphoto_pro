-- ==========================================
-- admin_users テーブル修正SQL
-- ==========================================
--
-- エラー内容: column "name" of relation "admin_users" does not exist
-- 原因: テーブルは存在するが name カラムがない
-- 解決策: name カラムを追加
--
-- 実行手順:
-- 1. https://supabase.com/dashboard/project/saeakxyazamxgmwpriqo を開く
-- 2. 左メニューから「SQL Editor」をクリック
-- 3. 「+ New query」ボタンをクリック
-- 4. このファイルの内容をコピー&ペースト
-- 5. 「Run」ボタンをクリック
--
-- ==========================================

-- name カラムを追加（存在しない場合のみ）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'name'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN name TEXT;
  END IF;
END $$;

-- updated_at カラムも追加（存在しない場合のみ）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
  END IF;
END $$;

-- 管理者ユーザーを作成（再実行しても安全）
INSERT INTO admin_users (email, password_hash, name, is_active)
VALUES (
  'admin@foodphoto-pro.com',
  '$2b$10$IQXXI3k3tzlLB8zvxt38yu31J7BnyAMzVBh4SOYERYnKkYj1HFi7.',
  'Administrator',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  updated_at = now();

-- ==========================================
-- 実行完了後のログイン情報
-- ==========================================
-- URL: http://localhost:3000/admin/login
-- Email: admin@foodphoto-pro.com
-- Password: admin123
--
-- ⚠️ 重要: 本番環境では必ずパスワードを変更してください！
-- ==========================================
