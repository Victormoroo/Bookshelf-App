/**
 * Lightweight toast/snackbar context. A single toast at a time, auto-dismissed
 * after a few seconds, with an optional action (e.g. "Desfazer").
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

export interface ToastData {
  message: string;
  /** Optional action label (e.g. "Ver", "Desfazer"). */
  action?: string;
  onAction?: () => void;
}

interface ToastContextValue {
  toast: ToastData | null;
  showToast: (message: string, action?: string, onAction?: () => void) => void;
  hideToast: () => void;
  runAction: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION = 3400;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hideToast = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, action?: string, onAction?: () => void) => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, action, onAction });
      timer.current = setTimeout(() => setToast(null), TOAST_DURATION);
    },
    [],
  );

  const runAction = useCallback(() => {
    const fn = toast?.onAction;
    hideToast();
    fn?.();
  }, [toast, hideToast]);

  const value = useMemo<ToastContextValue>(
    () => ({ toast, showToast, hideToast, runAction }),
    [toast, showToast, hideToast, runAction],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
