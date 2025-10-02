import React from 'react';
import Button from './Button';

/**
 * PUBLIC_INTERFACE
 * ErrorState
 * Displays a graceful error message with actions.
 * Props:
 *  - title: string
 *  - message: string
 *  - onRetry: function (optional)
 *  - retryLabel: string (default 'Retry')
 *  - secondary: { label, onClick, ariaLabel } (optional)
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
  onRetry,
  retryLabel = 'Retry',
  secondary,
}) {
  return (
    <section
      className="surface surface-animate"
      role="alert"
      aria-live="assertive"
      style={{
        padding: 18,
        border: '1px solid rgba(239,68,68,0.35)',
        background: 'rgba(239,68,68,0.06)',
      }}
    >
      <h3 style={{ marginTop: 0, color: 'var(--color-error)' }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)' }}>{message}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {onRetry ? (
          <Button variant="outline" onClick={onRetry} aria-label={retryLabel}>
            {retryLabel}
          </Button>
        ) : null}
        {secondary ? (
          <Button
            variant="subtle"
            onClick={secondary.onClick}
            aria-label={secondary.ariaLabel || secondary.label}
          >
            {secondary.label}
          </Button>
        ) : null}
      </div>
    </section>
  );
}
