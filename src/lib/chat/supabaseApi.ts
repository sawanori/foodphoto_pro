import type { ChatAPI, Conversation, Message } from '@/types/chat';
import { supabase } from '@/lib/supabase';

class SupabaseChatApiImpl implements ChatAPI {
  async start(): Promise<{ conversationId: string }> {
    try {
      // Create a new conversation
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          channel: 'web',
          status: 'new',
          session_token: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        throw error;
      }

      return { conversationId: data.id };
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
      // Check if this is the first message in the conversation
      const { data: existingMessages, error: checkError } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', params.conversationId)
        .eq('role', 'user')
        .limit(1);

      if (checkError) {
        console.error('Error checking existing messages:', checkError);
        throw checkError;
      }

      const isFirstUserMessage = !existingMessages || existingMessages.length === 0;

      // Insert the user message
      const { data: userMessage, error: userError } = await supabase
        .from('messages')
        .insert({
          conversation_id: params.conversationId,
          role: 'user',
          source: 'web',
          content: params.text,
          content_type: 'text/plain',
          delivered_to_line: false
        })
        .select()
        .single();

      if (userError) {
        console.error('Error sending message:', userError);
        throw userError;
      }

      // Update conversation last_message_at
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          status: 'active'
        })
        .eq('id', params.conversationId);

      // Auto-reply only for the first user message
      if (isFirstUserMessage) {
        setTimeout(async () => {
          await this.sendAutoReply(params.conversationId);
        }, 1000);
      }

      // Return void instead of the message
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }

  private async sendAutoReply(conversationId: string): Promise<void> {
    try {
      const autoReplyMessage = 'ご連絡ありがとうございます。担当者より折り返しご連絡させていただきます。';
      
      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'agent',
          source: 'web',
          content: autoReplyMessage,
          content_type: 'text/plain',
          delivered_to_line: false
        });

      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);
    } catch (error) {
      console.error('Failed to send auto reply:', error);
    }
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      
      // Return the data directly - it already matches the Message type
      const messages = data || [];
      
      return messages;
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  }

  async updateContact(params: {
    conversationId: string;
    name?: string;
    email?: string;
  }): Promise<void> {
    try {
      // First check if the conversation exists
      const { data: conversation, error: fetchError } = await supabase
        .from('conversations')
        .select('id, contact_name, contact_email')
        .eq('id', params.conversationId)
        .single();
      
      if (fetchError) {
        throw new Error(`Conversation not found: ${fetchError.message}`);
      }
      
      // Update the conversation
      const { error: updateError } = await supabase
        .from('conversations')
        .update({
          contact_name: params.name || null,
          contact_email: params.email || null
        })
        .eq('id', params.conversationId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error('Failed to update contact:', error);
      throw error;
    }
  }

  async listConversations(params?: {
    status?: 'new' | 'active' | 'closed';
    limit?: number;
  }): Promise<Conversation[]> {
    try {
      let query = supabase
        .from('conversations')
        .select('*')
        .order('last_message_at', { ascending: false });

      if (params?.status) {
        query = query.eq('status', params.status);
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error listing conversations:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to list conversations:', error);
      throw error;
    }
  }

  async closeConversation(conversationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({
          status: 'closed'
        })
        .eq('id', conversationId);

      if (error) {
        console.error('Error closing conversation:', error);
        throw error;
      }

    } catch (error) {
      console.error('Failed to close conversation:', error);
      throw error;
    }
  }
}

export const SupabaseChatApi = new SupabaseChatApiImpl();