import { createPortal } from 'react-dom';
import { useEffect, useState, useCallback, useId } from 'react';

type ToastType = 'error' | 'success' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  dedupKey?: string;
}

class ToastManager {
  private listeners: Set<(toasts: Toast[]) => void> = new Set();
  private toasts: Toast[] = [];
  private dedupMap: Map<string, string> = new Map();

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  show(message: string, type: ToastType = 'info', dedupKey?: string) {
    // If dedupKey is provided, check if a toast with this key already exists
    if (dedupKey && this.dedupMap.has(dedupKey)) {
      const existingId = this.dedupMap.get(dedupKey)!;
      const existingToast = this.toasts.find(t => t.id === existingId);
      if (existingToast) {
        // Update the existing toast's message
        existingToast.message = message;
        this.notify();
        return existingId;
      }
    }

    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type, dedupKey };
    
    this.toasts.push(toast);
    if (dedupKey) {
      this.dedupMap.set(dedupKey, id);
    }
    
    this.notify();

    // Auto-dismiss after 5 seconds
    setTimeout(() => this.dismiss(id), 5000);
    
    return id;
  }

  dismiss(id: string) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      const toast = this.toasts[index];
      if (toast.dedupKey) {
        this.dedupMap.delete(toast.dedupKey);
      }
      this.toasts.splice(index, 1);
      this.notify();
    }
  }

  clear() {
    this.toasts = [];
    this.dedupMap.clear();
    this.notify();
  }
}

// Global singleton instance
const toastManager = new ToastManager();

// Export convenience functions
export const toast = {
  error: (message: string, dedupKey?: string) => 
    toastManager.show(message, 'error', dedupKey),
  success: (message: string, dedupKey?: string) => 
    toastManager.show(message, 'success', dedupKey),
  info: (message: string, dedupKey?: string) => 
    toastManager.show(message, 'info', dedupKey),
  dismiss: (id: string) => toastManager.dismiss(id),
  clear: () => toastManager.clear(),
};

// ToastHost component
export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = toastManager.subscribe(setToasts);
    return unsubscribe;
  }, []);

  if (!mounted) return null;

  const portalRoot = document.getElementById('portal-root');
  if (!portalRoot) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            pointer-events-auto min-w-[300px] max-w-[400px] p-4 rounded-lg shadow-lg
            transform transition-all duration-300 animate-slide-in-up
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
          `}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => toastManager.dismiss(toast.id)}
              className="ml-4 text-white/80 hover:text-white transition-colors"
              aria-label="閉じる"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>,
    portalRoot
  );
}

// Hook for using toast in components
export function useToast() {
  return toast;
}