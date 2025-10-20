'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface ChatWidgetProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface Message {
  id: string;
  conversation_id?: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  source?: 'web' | 'admin' | 'line';
  content: string;
  created_at: string;
}

// 自動返信のパターン（キーワードマッチング）
const AUTO_REPLY_PATTERNS: Record<string, string> = {
  '料金': 'スタンダードプランは44,000円（税込）からご用意しております。プランには撮影、編集、納品が含まれます。詳細はお問い合わせください。',
  '流れ': '撮影の流れ：①お問い合わせ → ②日程調整 → ③撮影当日 → ④編集作業 → ⑤納品（約1週間）となります。',
  '納期': '通常、撮影後1週間程度で納品いたします。お急ぎの場合はご相談ください。',
  '見積': 'お見積もりをご希望の場合は、撮影内容やカット数をお知らせください。最適なプランをご提案いたします。',
  'こんにちは': 'こんにちは！何かお手伝いできることはありますか？',
  'はじめまして': 'はじめまして！撮影に関してご質問がございましたら、お気軽にお尋ねください。',
};

export default function ChatWidget({ isOpen: controlledIsOpen, onClose }: ChatWidgetProps = {}) {
  // ステート管理
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [contactInfo, setContactInfo] = useState({ name: '', email: '' });
  const [showContactForm, setShowContactForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // 開閉状態の管理
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  }, [onClose]);

  // Supabaseからメッセージを取得するuseEffect
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);

        // 既存の会話があるか確認
        let convId = conversationId;
        if (!convId) {
          // localStorage から会話IDを取得（端末固有の会話を復元）
          const savedConvId = localStorage.getItem('chatConversationId');

          if (savedConvId) {
            // 保存された会話IDを確認
            const { data: existingConv, error: checkError } = await supabase
              .from('conversations')
              .select('*')
              .eq('id', savedConvId)
              .single();

            if (checkError || !existingConv) {
              console.warn('Saved conversation not found, creating new one');
              localStorage.removeItem('chatConversationId');
            } else {
              convId = savedConvId;
              setConversationId(convId);
            }
          }

          // 保存された会話がない場合は新規作成
          if (!convId) {
            // 新規会話を作成
            const { data: newConv, error: createError } = await supabase
              .from('conversations')
              .insert({
                channel: 'web',
                status: 'new',
                session_token: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              })
              .select()
              .single();

            if (createError) {
              console.error('Error creating conversation:', createError);
              setIsLoading(false);
              return;
            }

            convId = newConv.id;
            // localStorage に会話IDを保存
            if (convId) {
              localStorage.setItem('chatConversationId', convId);
            }
            setConversationId(convId);
          }
        }

        // メッセージを取得
        if (convId) {
          const { data: fetchedMessages, error: msgError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', convId)
            .order('created_at', { ascending: true });

          if (msgError) {
            console.error('Error fetching messages:', msgError);
            setIsLoading(false);
            return;
          }

          // roleを正規化（'assistant' ⟶ 'agent', 'system' ⟶ 'system'等）
          const normalizedMessages: Message[] = (fetchedMessages || []).map(msg => ({
            ...msg,
            role: msg.role === 'assistant' ? 'agent' : msg.role,
          }));

          setMessages(normalizedMessages);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadMessages();
    }
  }, [isOpen, conversationId]);

  // チャット開閉時の処理
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // グローバルチャット開閉ボタンの設定
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-chat-open]')) {
        e.preventDefault();
        if (controlledIsOpen === undefined) {
          setInternalIsOpen(true);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [controlledIsOpen]);

  // メッセージ更新時の自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Supabaseリアルタイム購読（管理画面からのメッセージを監視）
  useEffect(() => {
    if (!conversationId || !isOpen) return;

    // リアルタイムチャネルを作成
    const channel = supabase
      .channel(`messages:conversation_id=eq.${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          console.log('New message received:', payload.new);
          // 新しいメッセージを追加
          const newMessage: Message = {
            id: payload.new.id,
            conversation_id: payload.new.conversation_id,
            role: payload.new.role === 'assistant' ? 'agent' : payload.new.role,
            source: payload.new.source,
            content: payload.new.content,
            created_at: payload.new.created_at,
          };
          setMessages(prev => {
            // 重複を避ける
            if (prev.some(msg => msg.id === newMessage.id)) {
              return prev;
            }
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    // クリーンアップ
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, isOpen]);

  // メッセージ送信（Supabaseに保存）
  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isTyping || !conversationId) return;

    setInputText('');
    setIsTyping(true);

    try {
      // 最初のユーザーメッセージかどうかを判定
      const isFirstUserMessage = !messages.some(msg => msg.role === 'user');

      // ユーザーメッセージをSupabaseに保存
      const { data: userMsg, error: userError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          role: 'user',
          source: 'web',
          content: messageText,
          content_type: 'text/plain',
          delivered_to_line: false,
        })
        .select()
        .single();

      if (userError) {
        console.error('Error sending message:', userError);
        setIsTyping(false);
        return;
      }

      // UIに即座に表示
      const userMessage: Message = {
        ...userMsg,
        role: 'user',
      };
      setMessages(prev => [...prev, userMessage]);

      // 会話のlast_message_atを更新
      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          status: 'active',
        })
        .eq('id', conversationId);

      // 最初のメッセージの場合のみ自動返信を生成
      if (isFirstUserMessage) {
        // 「入力中...」表示
        setTimeout(async () => {
          try {
            const replyContent = getAutoReply(messageText);

            // 自動返信をSupabaseに保存
            const { data: assistantMsg, error: assistantError } = await supabase
              .from('messages')
              .insert({
                conversation_id: conversationId,
                role: 'agent',
                source: 'web',
                content: replyContent,
                content_type: 'text/plain',
                delivered_to_line: false,
              })
              .select()
              .single();

            if (assistantError) {
              console.error('Error sending auto reply:', assistantError);
              setIsTyping(false);
              return;
            }

            // UIに即座に表示
            const assistantMessage: Message = {
              ...assistantMsg,
              role: 'agent',
            };
            setMessages(prev => [...prev, assistantMessage]);

            // 会話のlast_message_atを更新
            await supabase
              .from('conversations')
              .update({
                last_message_at: new Date().toISOString(),
              })
              .eq('id', conversationId);

            setIsTyping(false);
          } catch (error) {
            console.error('Error in auto reply:', error);
            setIsTyping(false);
          }
        }, 1000);
      } else {
        // 最初のメッセージ以降は即座に入力可能に
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  // 自動返信の生成（キーワードマッチング）
  const getAutoReply = (userMessage: string): string => {
    for (const [keyword, reply] of Object.entries(AUTO_REPLY_PATTERNS)) {
      if (userMessage.includes(keyword)) {
        return reply;
      }
    }
    return 'ご質問ありがとうございます。詳しい内容をお聞かせいただけますか？または、お問い合わせフォームからご連絡ください。';
  };

  // Enterキーでメッセージ送信
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 連絡先情報の更新（Supabaseに保存）
  const updateContactInfo = async () => {
    if (!contactInfo.name?.trim() && !contactInfo.email?.trim()) {
      alert('名前またはメールアドレスを入力してください');
      return;
    }

    if (contactInfo.email && !contactInfo.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('正しいメールアドレスを入力してください');
      return;
    }

    if (!conversationId) {
      alert('会話情報が見つかりません');
      return;
    }

    try {
      // Supabaseの conversations テーブルに保存
      const { error } = await supabase
        .from('conversations')
        .update({
          contact_name: contactInfo.name || null,
          contact_email: contactInfo.email || null,
        })
        .eq('id', conversationId);

      if (error) {
        console.error('Error updating contact info:', error);
        alert('連絡先の登録に失敗しました');
        return;
      }

      setShowContactForm(false);
      alert('連絡先を登録しました');
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました');
    }
  };

  // タイムスタンプのフォーマット
  const formatTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '時刻不明';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 right-0 left-0 sm:bottom-4 sm:right-4 sm:left-auto w-full sm:w-96 h-screen sm:h-[600px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
        >
          {/* ヘッダー */}
          <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-800">お問い合わせチャット</h2>
                <p className="text-xs text-gray-500 mt-1.5 font-normal">サービスに関してのご質問はこちら</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1.5 transition-all duration-200 transform hover:scale-110 hover:bg-gray-100"
                aria-label="チャットを閉じる"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* メッセージエリア */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-50 via-white to-slate-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500 font-medium">読み込み中...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium">メッセージはまだありません</p>
                  <p className="text-xs text-gray-400 mt-2">こんにちは！と話しかけてみてください</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-xs rounded-xl px-4 py-2.5 shadow-sm transition-all duration-200 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <span className={`text-xs mt-1.5 block font-light ${
                      message.role === 'user'
                        ? 'text-blue-200'
                        : 'text-gray-500'
                    }`}>{formatTime(message.created_at)}</span>
                  </div>
                </motion.div>
              ))
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 入力エリア */}
          <div className="border-t border-gray-100 bg-white space-y-3 p-3.5">
            {/* メッセージ入力 */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-400"
              />
              <button
                onClick={() => sendMessage()}
                disabled={isTyping || !inputText.trim() || !conversationId}
                className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:shadow-lg hover:from-blue-700 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-sm font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z" />
                </svg>
              </button>
            </div>

            {/* 連絡先入力フォーム - 洗練版 */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100 overflow-hidden">
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full text-left text-xs font-semibold text-gray-700 py-2.5 px-3.5 hover:bg-blue-100/50 transition-colors duration-200 flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <svg className={`w-4 h-4 text-blue-600 transform transition-transform duration-300 ${showContactForm ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                  連絡先を登録
                </span>
                <span className="text-xs text-gray-400">オプション</span>
              </button>

              {showContactForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 px-3.5 py-3 border-t border-blue-100 bg-white"
                >
                  <input
                    type="text"
                    placeholder="お名前"
                    value={contactInfo.name}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-300"
                  />
                  <input
                    type="email"
                    placeholder="メールアドレス"
                    value={contactInfo.email}
                    onChange={(e) =>
                      setContactInfo({ ...contactInfo, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-300"
                  />
                  <button
                    onClick={updateContactInfo}
                    className="w-full px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 text-xs font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-sm"
                  >
                    登録する
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
