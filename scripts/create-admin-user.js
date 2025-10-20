/**
 * 管理者ユーザー作成ヘルパースクリプト
 *
 * 使い方:
 * node scripts/create-admin-user.js <email> <password> <name>
 *
 * 例:
 * node scripts/create-admin-user.js admin@example.com MyPassword123 "Admin User"
 */

const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error('使い方: node scripts/create-admin-user.js <email> <password> [name]');
    console.error('例: node scripts/create-admin-user.js admin@example.com MyPassword123 "Admin User"');
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];
  const name = args[2] || 'Administrator';

  try {
    // Generate password hash
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate SQL
    const sql = `
-- 管理者ユーザー作成SQL
-- Email: ${email}
-- Name: ${name}

INSERT INTO admin_users (email, password_hash, name, is_active)
VALUES (
  '${email}',
  '${passwordHash}',
  '${name}',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  updated_at = now();
`;

    console.log('\n✅ パスワードハッシュが生成されました！\n');
    console.log('以下のSQLをSupabase SQL Editorで実行してください:');
    console.log('='.repeat(60));
    console.log(sql);
    console.log('='.repeat(60));
    console.log('\n📝 実行手順:');
    console.log('1. https://supabase.com/dashboard/project/saeakxyazamxgmwpriqo を開く');
    console.log('2. 左メニューから「SQL Editor」をクリック');
    console.log('3. 上記のSQLをコピー&ペースト');
    console.log('4. 「Run」ボタンをクリック\n');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  }
}

createAdminUser();
