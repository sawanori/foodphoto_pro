import type { ChatAPI, Message } from '@/types/chat';

/**
 * API Client that uses server-side endpoints instead of direct Supabase access
 * This ensures proper authentication and bypasses RLS restrictions
 */
class ApiChatClient implements ChatAPI {
  async start(): Promise<{ conversationId: string }> {
    try {
      const response = await fetch('/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to start chat: ${response.status}`);
      }

      const data = await response.json();
      return { conversationId: data.conversationId };
    } catch (error) {
      console.error('Failed to start chat:', error);
      throw error;
    }
  }

  async sendMessage(params: {
    conversationId: string;
    text: string;
  }): Promise<void> {
    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: params.conversationId,
          content: params.text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      // Sync conversationId from server in case it was created/changed
      // This prevents stale IDs from breaking history fetches
      try {
        const data = await response.json().catch(() => null);
        const serverConversationId = data?.conversationId;
        if (serverConversationId && typeof window !== 'undefined') {
          const storedId = sessionStorage.getItem('chat_conversation_id');
          if (storedId !== serverConversationId) {
            sessionStorage.setItem('chat_conversation_id', serverConversationId);
          }
        }
      } catch (e) {
        // Non-fatal: response might not contain JSON on some paths
        console.warn('[ApiClient] Could not parse send response JSON:', e);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      console.log('[ApiClient] Fetching messages for conversation:', conversationId);
      const response = await fetch(`/api/chat/history?conversationId=${conversationId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('[ApiClient] Failed to fetch messages:', response.status);
        throw new Error(`Failed to get messages: ${response.status}`);
      }

      const data = await response.json();
      console.log('[ApiClient] Response data:', data);
      console.log('[ApiClient] Messages count:', data.items?.length || 0);
      if (data.items && data.items.length > 0) {
        console.log('[ApiClient] First message:', data.items[0]);
      }
      return data.items || [];
    } catch (error) {
      console.error('[ApiClient] Failed to get messages:', error);
      throw error;
    }
  }

  async updateContact(params: {
    conversationId: string;
    name?: string;
    email?: string;
  }): Promise<void> {
    try {
      const response = await fetch('/api/chat/update-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: params.conversationId,
          name: params.name,
          email: params.email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update contact: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error;
    }
  }

  // Not used by client, but required by interface
  async listConversations(): Promise<any[]> {
    return [];
  }

  async closeConversation(): Promise<void> {
    // Not used by client
  }
}

export const ApiChatApi = new ApiChatClient();
