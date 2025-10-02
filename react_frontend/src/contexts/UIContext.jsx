import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * UIProvider
 * Provides global UI state for modals and toasts/snackbars.
 * Exposes:
 *  - modal state: authOpen, authDefaultMode, uploadOpen
 *  - actions: openAuth(mode), closeAuth(), openUpload(), closeUpload()
 *  - toast state: toasts[]
 *  - actions: showToast({ message, type, duration }), removeToast(id), clearToasts()
 */
const UIContext = createContext(null);

// PUBLIC_INTERFACE
export function UIProvider({ children }) {
  /** Global UI state for modals and toast notifications. */
  // Modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState('login'); // 'login' | 'signup'
  const [uploadOpen, setUploadOpen] = useState(false);

  // Toast state
  const [toasts, setToasts] = useState([]);

  // Modal actions
  // PUBLIC_INTERFACE
  const openAuth = useCallback((mode = 'login') => {
    setAuthDefaultMode(mode);
    setAuthOpen(true);
  }, []);

  // PUBLIC_INTERFACE
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  // PUBLIC_INTERFACE
  const openUpload = useCallback(() => setUploadOpen(true), []);

  // PUBLIC_INTERFACE
  const closeUpload = useCallback(() => setUploadOpen(false), []);

  // Toast actions
  // PUBLIC_INTERFACE
  const showToast = useCallback(({ message, type = 'info', duration = 2500 }) => {
    /** Show a toast. Returns the toast id for manual dismissal if needed. */
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const toast = { id, message, type, duration };
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  // PUBLIC_INTERFACE
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // PUBLIC_INTERFACE
  const clearToasts = useCallback(() => setToasts([]), []);

  const value = useMemo(
    () => ({
      // modal state
      authOpen,
      authDefaultMode,
      uploadOpen,
      // modal actions
      openAuth,
      closeAuth,
      openUpload,
      closeUpload,
      // toasts
      toasts,
      showToast,
      removeToast,
      clearToasts,
    }),
    [
      authOpen,
      authDefaultMode,
      uploadOpen,
      openAuth,
      closeAuth,
      openUpload,
      closeUpload,
      toasts,
      showToast,
      removeToast,
      clearToasts,
    ]
  );

  return (
    <UIContext.Provider value={value}>
      {children}
      <ToastHost toasts={toasts} onClose={removeToast} />
    </UIContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useUI() {
  /** Access UIContext values and actions. */
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within a UIProvider');
  return ctx;
}

/**
 * ToastHost
 * Renders toasts in the bottom center with subtle styling.
 */
function ToastHost({ toasts, onClose }) {
  if (!Array.isArray(toasts) || toasts.length === 0) return null;

  const colorFor = (type) => {
    switch (type) {
      case 'success':
        return { bg: 'rgba(16,185,129,0.14)', fg: '#10B981', bd: 'rgba(16,185,129,0.35)' };
      case 'error':
        return { bg: 'rgba(239,68,68,0.14)', fg: 'var(--color-error)', bd: 'rgba(239,68,68,0.35)' };
      case 'warning':
        return { bg: 'rgba(245,158,11,0.14)', fg: 'var(--color-warning)', bd: 'rgba(245,158,11,0.35)' };
      default:
        return { bg: 'rgba(59,130,246,0.14)', fg: 'var(--color-info)', bd: 'rgba(59,130,246,0.35)' };
    }
  };

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 20,
        display: 'grid',
        placeItems: 'center',
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      <div style={{ display: 'grid', gap: 8, width: 'min(560px, 92vw)' }}>
        {toasts.map((t) => {
          const c = colorFor(t.type);
          return (
            <div
              key={t.id}
              className="surface surface-animate"
              style={{
                pointerEvents: 'auto',
                background: c.bg,
                color: c.fg,
                border: `1px solid ${c.bd}`,
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
              role="status"
              aria-live="polite"
            >
              <div style={{ fontSize: 'var(--font-sm)' }}>{t.message}</div>
              <button
                className="icon-btn"
                aria-label="Dismiss notification"
                onClick={() => onClose?.(t.id)}
                title="Dismiss notification"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
