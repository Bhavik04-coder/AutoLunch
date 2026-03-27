'use client';

import styles from './ToastContainer.module.scss';
import type { ToastMessage } from '@/types';
import clsx from 'clsx';

const ICONS: Record<string, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (!toasts.length) return null;
  return (
    <div className={styles.container} aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={clsx(styles.toast, styles[t.variant])}>
          <span className={styles.icon}>{ICONS[t.variant]}</span>
          <span className={styles.message}>{t.message}</span>
          <button
            type="button"
            className={styles.close}
            onClick={() => onRemove(t.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
