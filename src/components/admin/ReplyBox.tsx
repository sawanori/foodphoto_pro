'use client';

import { useState, useRef, KeyboardEvent, useEffect, useCallback } from 'react';
import { useToast } from '@/lib/ui/toast';

interface ReplyBoxProps {
  conversationId: string;
  onMessageSent?: () => void;
}

// Quick reply templates
const QUICK_REPLIES = [
  'お問い合わせありがとうございます。',
  '承知いたしました。確認して折り返しご連絡いたします。',
  'お待たせしました。以下がご回答です。',
  '何か不明な点がございましたら、お気軽にお尋ねください。'
];

export function ReplyBox({ conversationId, onMessageSent }: ReplyBoxProps) {
  const toast = useToast();
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const draftKey = `draft-${conversationId}`;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setText(savedDraft);
      toast.info('下書きを復元しました');
    }
  }, [conversationId, draftKey, toast]);

  // Save draft with debounce
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (text) {
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(draftKey, text);
      }, 1000);
    } else {
      localStorage.removeItem(draftKey);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [text, draftKey]);

  const insertQuickReply = useCallback((template: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = text.substring(0, start) + template + text.substring(end);
    setText(newText);
    
    // Focus and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + template.length, start + template.length);
    }, 0);
    
    setShowQuickReplies(false);
  }, [text]);

  async function sendReply() {
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          content: text.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Failed to send reply');
      }

      setText('');
      localStorage.removeItem(draftKey);
      if (onMessageSent) {
        onMessageSent();
      }
      toast.success('返信を送信しました')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send reply:', error);
      toast.error(error instanceof Error ? error.message : '返信の送信に失敗しました', 'reply-error');
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Cmd/Ctrl + Enter to send
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendReply();
    }
    // Cmd/Ctrl + K for quick replies
    else if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setShowQuickReplies(!showQuickReplies);
    }
    // Regular Enter for new line (shift not needed)
  }

  function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }

  return (
    <div className="border-t bg-white">
      {/* Quick Replies */}
      {showQuickReplies && (
        <div className="p-3 border-b bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">クイック返信テンプレート：</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply, index) => (
              <button
                key={index}
                onClick={() => insertQuickReply(reply)}
                className="px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="flex gap-3">
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="返信を入力... (Cmd/Ctrl+Enterで送信)"
            disabled={isLoading}
            rows={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            style={{ minHeight: '40px', maxHeight: '150px' }}
          />
        </div>
        <button
          onClick={sendReply}
          disabled={isLoading || !text.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            '送信'
          )}
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <p>Cmd/Ctrl+Enterで送信、Cmd/Ctrl+Kでクイック返信</p>
        {text && <p>下書き保存中...</p>}
      </div>
    </div>
    </div>
  );
}