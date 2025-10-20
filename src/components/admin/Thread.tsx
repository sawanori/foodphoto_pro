'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ReplyBox } from './ReplyBox';
import type { Message, Conversation } from '@/types/chat';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { useToast } from '@/lib/ui/toast';

interface ThreadProps {
  conversationId: string;
}

// Loading skeleton component
function MessageSkeleton() {
  return (
    <div className="space-y-4 max-w-3xl mx-auto animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
          <div className="max-w-[70%]">
            <div className={`h-16 rounded-2xl bg-gray-300 ${i % 2 === 0 ? 'bg-blue-200' : ''}`} />
            <div className="mt-1 h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Thread({ conversationId }: ThreadProps) {
  const toast = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchConversationAndMessages();

    // Start polling for new messages
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(() => {
      fetchConversationAndMessages();
    }, 3000); // Poll every 3 seconds

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchConversationAndMessages() {
    try {
      // Use admin API endpoint which has service role access
      const response = await fetch(`/api/admin/messages?conversationId=${conversationId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Admin API error:', { status: response.status, error: errorText });
        throw new Error(`API error: ${response.status}`);
      }

      const { conversation, messages } = await response.json();

      console.log('Fetched conversation and messages:', {
        conversationId,
        hasConversation: !!conversation,
        messageCount: messages?.length || 0
      });

      if (conversation) {
        setConversation(conversation);
      } else {
        console.error('Conversation not found:', conversationId);
        setConversation(null);
      }

      if (messages) {
        setMessages(messages);
        setMessageCount(messages.length);
      } else {
        console.log('No messages found for conversation:', conversationId);
        setMessages([]);
        setMessageCount(0);
      }
    } catch (error) {
      console.error('Error fetching conversation and messages:', error);
      setConversation(null);
      setMessages([]);
      setMessageCount(0);
    } finally {
      setIsLoading(false);
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  async function toggleStatus() {
    if (!conversation) return;

    const isActive = conversation.status === 'new' || conversation.status === 'active';
    const newStatus = isActive ? 'closed' : 'active';

    try {
      const response = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, status: newStatus })
      });

      if (!response.ok) {
        console.error('Failed to update status:', await response.text());
        toast.error('ステータスの更新に失敗しました', 'status-error');
        return;
      }

      setConversation({ ...conversation, status: newStatus });
      toast.success(newStatus === 'closed' ? '会話をクローズしました' : '会話を再開しました');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('ステータスの更新に失敗しました', 'status-error');
    }
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        {/* Skeleton Header */}
        <div className="px-4 py-3 border-b bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 w-32 bg-gray-300 rounded animate-pulse mb-2" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-20 bg-gray-300 rounded-full animate-pulse" />
              <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        {/* Skeleton Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <MessageSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-900">
                {conversation?.contact_name || '（名前未設定）'}
              </h3>
              {messageCount > 0 && (
                <span className="text-xs text-gray-500">
                  {messageCount}件のメッセージ
                </span>
              )}
            </div>
            {conversation?.contact_email && (
              <p className="text-sm text-gray-500">{conversation.contact_email}</p>
            )}
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <span>チャンネル: {conversation?.channel === 'web' ? 'Web' : 'LINE'}</span>
              <span>最終更新: {formatTime(conversation?.last_message_at || '')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              conversation?.status === 'new' || conversation?.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {(conversation?.status === 'new' || conversation?.status === 'active') ? '未対応' : '対応済み'}
            </span>
            <button
              onClick={toggleStatus}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {(conversation?.status === 'new' || conversation?.status === 'active') ? 'クローズ' : '再開'}
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg
              className="w-16 h-16 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-gray-500 text-lg mb-2">まだメッセージがありません</p>
            <p className="text-gray-400 text-sm">お客様からのメッセージをお待ちください</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'agent' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`max-w-[70%] ${
                  message.role === 'agent' ? 'order-2' : ''
                }`}>
                  {/* Message bubble */}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.role === 'agent'
                        ? 'bg-blue-500 text-white'
                        : message.role === 'system'
                        ? 'bg-gray-200 text-gray-700 italic'
                        : 'bg-white text-gray-900 shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {/* Metadata */}
                  <div className={`mt-1 text-xs text-gray-500 ${
                    message.role === 'agent' ? 'text-right' : ''
                  }`}>
                    <span>{formatTime(message.created_at)}</span>
                    {message.source && (
                      <span className="ml-2">
                        {message.source === 'web' ? 'Web' : 
                         message.source === 'admin' ? '管理画面' : 'LINE'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Reply Box */}
      {(conversation?.status === 'new' || conversation?.status === 'active') && (
        <ReplyBox
          conversationId={conversationId}
          onMessageSent={() => {
            fetchConversationAndMessages();
            scrollToBottom();
          }}
        />
      )}
    </div>
  );
}