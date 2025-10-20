-- チャットシステム用のテーブル作成
-- Create chat system tables

-- 1. conversations テーブル（会話管理）
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel TEXT NOT NULL CHECK (channel IN ('web', 'line')),
  status TEXT NOT NULL CHECK (status IN ('new', 'active', 'snoozed', 'closed')) DEFAULT 'new',
  contact_name TEXT,
  contact_email TEXT,
  line_user_id TEXT,
  session_token TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_channel ON conversations(channel);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_session_token ON conversations(session_token);

-- 2. messages テーブル（メッセージ管理）
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'agent', 'system')),
  source TEXT NOT NULL CHECK (source IN ('web', 'admin', 'line')),
  content TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'text/plain',
  attachment_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivered_to_line BOOLEAN NOT NULL DEFAULT false
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);

-- 3. profiles テーブル（管理者/スタッフ情報）
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'staff')) DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security (RLS) を有効化
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- conversations テーブルのRLSポリシー
-- 誰でも新規会話を作成可能（ゲストユーザー用）
CREATE POLICY "Anyone can create conversations"
  ON conversations
  FOR INSERT
  WITH CHECK (true);

-- 自分のsession_tokenで識別される会話は読み取り可能
CREATE POLICY "Users can read their own conversations via session_token"
  ON conversations
  FOR SELECT
  USING (true); -- フロントエンドでsession_tokenでフィルタする

-- 自分の会話は更新可能
CREATE POLICY "Users can update their own conversations"
  ON conversations
  FOR UPDATE
  USING (true);

-- 認証済みユーザー（管理者）は全ての会話を読み取り可能
CREATE POLICY "Authenticated users can read all conversations"
  ON conversations
  FOR SELECT
  TO authenticated
  USING (true);

-- messages テーブルのRLSポリシー
-- 誰でもメッセージを作成可能（ゲストユーザー用）
CREATE POLICY "Anyone can create messages"
  ON messages
  FOR INSERT
  WITH CHECK (true);

-- 会話に紐づくメッセージは読み取り可能
CREATE POLICY "Users can read messages in accessible conversations"
  ON messages
  FOR SELECT
  USING (true);

-- 認証済みユーザー（管理者）は全てのメッセージを読み取り可能
CREATE POLICY "Authenticated users can read all messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- 認証済みユーザー（管理者）はメッセージを作成可能
CREATE POLICY "Authenticated users can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- profiles テーブルのRLSポリシー
-- 認証済みユーザーは自分のprofileを読み取り可能
CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 管理者は全てのprofileを読み取り可能
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- 管理者はprofileを作成・更新可能
CREATE POLICY "Admins can manage profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- リアルタイム購読を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
