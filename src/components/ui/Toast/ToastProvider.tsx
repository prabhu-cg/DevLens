import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { X } from 'lucide-react';
import { IconButton } from '../IconButton';
import { generateId } from '../../../utils/id';
import styles from './Toast.module.css';

export type ToastVariant = 'neutral' | 'success' | 'warning' | 'error';

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastEntry extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const showToast = useCallback((options: ToastOptions) => {
    setToasts((current) => [...current, { id: generateId(), ...options }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <RadixToast.Root
            key={toast.id}
            className={styles.root}
            data-variant={toast.variant ?? 'neutral'}
            duration={5000}
            onOpenChange={(open) => {
              if (!open) dismissToast(toast.id);
            }}
          >
            <div className={styles.body}>
              <RadixToast.Title className={styles.title}>{toast.title}</RadixToast.Title>
              {toast.description && (
                <RadixToast.Description className={styles.description}>
                  {toast.description}
                </RadixToast.Description>
              )}
            </div>
            <RadixToast.Close asChild className={styles.close}>
              <IconButton icon={<X aria-hidden="true" />} label="Dismiss notification" size="sm" />
            </RadixToast.Close>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className={styles.viewport} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
