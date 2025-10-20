'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), {
  ssr: false,
  loading: () => null
});

interface LazyChatProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function LazyChat({ isOpen, onClose }: LazyChatProps) {
  return (
    <Suspense fallback={null}>
      <ChatWidget isOpen={isOpen} onClose={onClose} />
    </Suspense>
  );
}