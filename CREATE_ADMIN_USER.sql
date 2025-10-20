-- ==========================================
-- 管理者ユーザー作成SQL
-- ==========================================
--
-- 実行手順:
-- 1. https://supabase.com/dashboard/project/saeakxyazamxgmwpriqo を開く
-- 2. 左メニューから「SQL Editor」をクリック
-- 3. 「+ New query」ボタンをクリック
-- 4. このファイルの内容をコピー&ペースト
-- 5. 「Run」ボタンをクリック
--
-- ログイン情報:
-- URL: http://localhost:3000/admin/login
-- Email: admin@foodphoto-pro.com
-- Password: admin123
--
-- ⚠️ 重要: 本番環境では必ずパスワードを変更してください！
--
-- ==========================================

-- 管理者ユーザー作成
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
