import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * AuthModal
 * Login/Signup modal for Supabase email/password auth.
 * Props:
 *  - open: boolean to show/hide modal
 *  - onClose: function to close the modal
 *  - defaultMode: 'login' | 'signup'
 */
export default function AuthModal({ open, onClose, defaultMode = 'login' }) {
  const { signInWithPassword, signUpWithPassword, error } = useAuth();
  const [mode, setMode] = useState(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Keep internal mode in sync with prop when it changes while modal is (re-)opened
  useEffect(() => {
    if (open) setMode(defaultMode);
  }, [defaultMode, open]);

  if (!open) return null;

  const isLogin = mode === 'login';

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithPassword(email, password);
        onClose?.();
      } else {
        await signUpWithPassword(email, password);
        // Inform user to check email if confirmation required.
        alert('If email confirmation is required, please check your inbox to verify your account.');
        onClose?.();
      }
    } catch (e2) {
      // Handled by context error state; keep UX minimal.
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(2,6,23,0.45)',
        zIndex: 40,
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="surface surface-animate"
        style={{
          width: 'min(480px, 96vw)',
          padding: 18,
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--color-surface)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0 }}>{isLogin ? 'Welcome back' : 'Create your account'}</h3>
          <button
            className="icon-btn"
            aria-label="Close"
            onClick={() => onClose?.()}
            title="Close"
          >
            ✕
          </button>
        </div>

        <p style={{ marginTop: 6, color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>
          {isLogin ? 'Sign in to manage your notes and uploads.' : 'Sign up to start uploading and saving notes.'}
        </p>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <Input
            id="auth-email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="auth-password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            helpText={isLogin ? 'Use your account password.' : 'Minimum 6 characters recommended.'}
          />
          {error ? (
            <div role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--font-sm)' }}>
              {error}
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
            <Button type="submit" variant="primary" fullWidth>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => setMode(isLogin ? 'signup' : 'login')}
            >
              {isLogin ? 'Need an account? Sign Up' : 'Have an account? Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
