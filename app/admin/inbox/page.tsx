'use client';

import { useState, useEffect } from 'react';
import { ConversationList } from '@/components/admin/ConversationList';
import { Thread } from '@/components/admin/Thread';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch('/api/admin/auth/verify');
      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              チャット管理画面
            </h1>
            <button
              onClick={async () => {
                try {
                  await fetch('/api/admin/auth/logout', { method: 'POST' });
                } catch (error) {
                  console.error('Logout error:', error);
                }
                router.push('/admin/login');
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Layout */}
        <div className="hidden md:flex w-full">
          {/* Conversation List */}
          <aside className="w-96 bg-white border-r overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">会話一覧</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ConversationList
                onSelect={setActiveId}
                activeId={activeId}
              />
            </div>
          </aside>

          {/* Thread View */}
          <main className="flex-1 bg-white">
            {activeId ? (
              <Thread conversationId={activeId} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <p className="mt-2">会話を選択してください</p>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden w-full">
          {activeId ? (
            <div className="h-full flex flex-col">
              <div className="p-4 bg-white border-b">
                <button
                  onClick={() => setActiveId('')}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  戻る
                </button>
              </div>
              <div className="flex-1">
                <Thread conversationId={activeId} />
              </div>
            </div>
          ) : (
            <div className="h-full bg-white">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">会話一覧</h2>
              </div>
              <ConversationList
                onSelect={setActiveId}
                activeId={activeId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
