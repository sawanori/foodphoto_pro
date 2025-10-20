'use client';

import { ToastHost } from '@/lib/ui/toast';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <div id="portal-root" />
      <ToastHost />
    </>
  );
}