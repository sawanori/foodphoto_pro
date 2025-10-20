export type Channel = 'web' | 'line';
export type ConvStatus = 'new' | 'active' | 'snoozed' | 'closed';
export type MsgRole = 'user' | 'agent' | 'system';

export interface Conversation {
  id: string;
  channel: Channel; // v1 は 'web' 固定でOK
  status: ConvStatus; // 'open' | 'closed'
  contact_name?: string | null;
  contact_email?: string | null;
  last_message_at: string; // ISO8601
  assigned_to?: string | null;
  created_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MsgRole; // 'user' | 'agent' | 'system'
  source: 'web' | 'admin' | 'line';
  content: string;
  content_type?: string; // 'text/plain' 等（拡張用）
  created_at: string; // ISO8601
  created_by?: string | null;
}

export interface ChatAPI {
  start(): Promise<{ conversationId: string }>; // ゲスト開始（CookieはAPI側で発行）
  listConversations(params?: { 
    status?: ConvStatus; 
    q?: string; 
    limit?: number; 
  }): Promise<Conversation[]>; // 管理用
  getMessages(conversationId: string): Promise<Message[]>;
  sendMessage(params: { 
    conversationId: string; 
    text: string 
  }): Promise<void>;
  updateContact(params: {
    conversationId: string;
    name?: string;
    email?: string;
  }): Promise<void>;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          channel: Channel;
          status: ConvStatus;
          contact_name: string | null;
          contact_email: string | null;
          line_user_id: string | null;
          session_token: string | null;
          assigned_to: string | null;
          created_at: string;
          last_message_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>;
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          role: MsgRole;
          source: 'web' | 'admin' | 'line';
          content: string;
          content_type: string;
          attachment_url: string | null;
          created_by: string | null;
          created_at: string;
          delivered_to_line: boolean;
        };
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['messages']['Insert']>;
      };
      profiles: {
        Row: {
          user_id: string;
          role: 'admin' | 'staff';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
    };
  };
}