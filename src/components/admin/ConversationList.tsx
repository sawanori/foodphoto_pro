'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Conversation } from '@/types/chat';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface ConversationListProps {
  onSelect: (id: string) => void;
  activeId?: string;
}

type SortOption = 'recent' | 'oldest' | 'name';

export function ConversationList({ onSelect, activeId }: ConversationListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>(
    (searchParams.get('filter') as 'all' | 'active' | 'closed') || 'active'
  );
  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'recent'
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  // Don't seed mock data automatically - only use when Supabase fails
  // useEffect(() => {
  //   seedMockData();
  // }, []);

  // Update URL when filter/sort changes
  const updateUrl = useCallback((newFilter?: string, newSort?: string, newQuery?: string) => {
    const params = new URLSearchParams(searchParams);
    if (newFilter !== undefined) params.set('filter', newFilter);
    if (newSort !== undefined) params.set('sort', newSort);
    if (newQuery !== undefined) {
      if (newQuery) params.set('q', newQuery);
      else params.delete('q');
    }
    router.push(`/admin/inbox?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    fetchConversations();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'conversations' 
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter, sortBy, searchQuery]);

  async function fetchConversations() {
    try {
      // Use admin API endpoint to fetch conversations with service role key
      const response = await fetch(`/api/admin/conversations?filter=${filter}&limit=50`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API response error:', { status: response.status, error: errorText });
        throw new Error(`API error: ${response.status}`);
      }

      const { conversations } = await response.json();

      console.log('Fetching conversations from API:', { 
        conversations, 
        count: conversations?.length,
        filter,
        useMock: process.env.NEXT_PUBLIC_USE_MOCK
      });

      if (conversations) {
        setConversations(sortConversations(filterBySearch(conversations)));
      } else {
        // No conversations found
        console.log('No conversations found in database');
        setConversations([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Don't use mock data - show empty state or error
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }

  const filterBySearch = useCallback((convs: Conversation[]) => {
    if (!searchQuery) return convs;
    const query = searchQuery.toLowerCase();
    return convs.filter(conv => 
      (conv.contact_name?.toLowerCase().includes(query)) ||
      (conv.contact_email?.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const sortConversations = useCallback((convs: Conversation[]) => {
    const sorted = [...convs];
    switch (sortBy) {
      case 'recent':
        return sorted.sort((a, b) => 
          new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.last_message_at).getTime() - new Date(b.last_message_at).getTime()
        );
      case 'name':
        return sorted.sort((a, b) => 
          (a.contact_name || '').localeCompare(b.contact_name || '')
        );
      default:
        return sorted;
    }
  }, [sortBy]);

  function handleRealtimeUpdate(payload: RealtimePostgresChangesPayload<any>) {
    if (payload.eventType === 'INSERT') {
      const newConv = payload.new as Conversation;
      setConversations((prev) => sortConversations(filterBySearch([newConv, ...prev])));
    } else if (payload.eventType === 'UPDATE') {
      const updatedConv = payload.new as Conversation;
      setConversations((prev) => {
        const updated = prev.map((c) => 
          c.id === updatedConv.id ? updatedConv : c
        );
        return sortConversations(filterBySearch(updated));
      });
    } else if (payload.eventType === 'DELETE') {
      const deletedId = payload.old.id;
      setConversations((prev) => prev.filter((c) => c.id !== deletedId));
    }
  }

  function formatTime(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (days === 1) {
      return '昨日';
    } else if (days < 7) {
      return `${days}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="px-4 py-3 border-b bg-white">
        <input
          type="text"
          placeholder="名前またはメールアドレスで検索..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            updateUrl(undefined, undefined, e.target.value);
          }}
          className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Filter Tabs & Sort */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilter('active');
                updateUrl('active');
              }}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'active'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            未対応
          </button>
            <button
              onClick={() => {
                setFilter('closed');
                updateUrl('closed');
              }}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'closed'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            対応済み
          </button>
            <button
              onClick={() => {
                setFilter('all');
                updateUrl('all');
              }}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
              すべて
            </button>
          </div>
          
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as SortOption);
              updateUrl(undefined, e.target.value);
            }}
            className="px-3 py-1 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="recent">最新順</option>
            <option value="oldest">古い順</option>
            <option value="name">名前順</option>
          </select>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p>会話がありません</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  activeId === conv.id ? 'bg-orange-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        conv.status === 'new' || conv.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {(conv.status === 'new' || conv.status === 'active') ? '未対応' : '対応済み'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {conv.channel === 'web' ? 'Web' : 'LINE'}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 truncate">
                      {conv.contact_name || '（名前未設定）'}
                    </p>
                    {conv.contact_email && (
                      <p className="text-sm text-gray-500 truncate">
                        {conv.contact_email}
                      </p>
                    )}
                  </div>
                  <div className="ml-2 flex-shrink-0">
                    <p className="text-xs text-gray-500">
                      {formatTime(conv.last_message_at)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}