import React from 'react';
import Button from './Button';
import Badge from './Badge';

/**
 * PUBLIC_INTERFACE
 * EmptyState
 * A consistent empty state component with optional actions.
 * Props:
 *  - title: string
 *  - description: string
 *  - primaryAction: { label, onClick, ariaLabel }
 *  - secondaryAction: { label, onClick, ariaLabel }
 *  - icon: optional React node
 *  - badge: optional string badge text (uses primary variant)
 */
export default function EmptyState({
  title = 'Nothing to show',
  description = 'Try adjusting your filters or add new content.',
  primaryAction,
  secondaryAction,
  icon = '📄',
  badge,
}) {
  return (
    <section
      className="surface surface-animate"
      aria-live="polite"
      style={{
        padding: 22,
        textAlign: 'center',
        border: '1px dashed var(--color-border)',
        background:
          'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(245,158,11,0.04))',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: 38,
          lineHeight: 1,
          marginBottom: 8,
          filter: 'saturate(1.1)',
        }}
      >
        {icon}
      </div>
      {badge ? (
        <div style={{ marginBottom: 8 }}>
          <Badge variant="primary" size="sm">{badge}</Badge>
        </div>
      ) : null}
      <h3 style={{ marginTop: 0, marginBottom: 6 }}>{title}</h3>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>{description}</p>
      {(primaryAction || secondaryAction) && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 10 }}>
          {secondaryAction ? (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              aria-label={secondaryAction.ariaLabel || secondaryAction.label}
            >
              {secondaryAction.label}
            </Button>
          ) : null}
          {primaryAction ? (
            <Button
              variant="primary"
              onClick={primaryAction.onClick}
              aria-label={primaryAction.ariaLabel || primaryAction.label}
            >
              {primaryAction.label}
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
}
