import React from 'react';

/**
 * PUBLIC_INTERFACE
 * LoadingSkeleton
 * A flexible skeleton loader component for showing loading placeholders.
 * Props:
 *  - lines: number of text lines to show (default 3)
 *  - variant: 'card' | 'text' | 'thumbnail' (default 'card')
 *  - height: custom height in px for block skeletons (optional)
 *  - ariaLabel: string for aria-busy description
 */
export default function LoadingSkeleton({
  lines = 3,
  variant = 'card',
  height,
  ariaLabel = 'Content is loading',
}) {
  const shimmer = {
    background:
      'linear-gradient(90deg, rgba(148,163,184,0.15) 25%, rgba(148,163,184,0.25) 37%, rgba(148,163,184,0.15) 63%)',
    backgroundSize: '400% 100%',
    animation: 'skeleton-shimmer 1.4s ease infinite',
  };

  const base = {
    display: 'block',
    width: '100%',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(148,163,184,0.15)',
    ...shimmer,
  };

  const lineStyle = (w = '100%') => ({
    ...base,
    height: 10,
    width: w,
  });

  if (variant === 'text') {
    return (
      <div role="status" aria-live="polite" aria-label={ariaLabel}>
        <div style={{ display: 'grid', gap: 8 }}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              style={lineStyle(i === lines - 1 ? '70%' : '100%')}
              aria-hidden="true"
            />
          ))}
        </div>
        <style>
          {`
          @keyframes skeleton-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
        </style>
      </div>
    );
  }

  if (variant === 'thumbnail') {
    return (
      <div role="status" aria-live="polite" aria-label={ariaLabel}>
        <div
          style={{
            ...base,
            height: height || 160,
            borderRadius: 'var(--radius-lg)',
          }}
          aria-hidden="true"
        />
        <style>
          {`
          @keyframes skeleton-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
        </style>
      </div>
    );
  }

  // default 'card' variant
  return (
    <div
      className="surface surface-animate"
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
      style={{ padding: 14, display: 'grid', gap: 10 }}
    >
      <div style={{ ...lineStyle('55%'), height: 14 }} aria-hidden="true" />
      <div style={{ display: 'grid', gap: 8 }}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} style={lineStyle(i % 3 === 0 ? '95%' : '100%')} aria-hidden="true" />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ ...lineStyle('18%'), height: 28, borderRadius: 'var(--radius-pill)' }} aria-hidden="true" />
        <div style={{ ...lineStyle('18%'), height: 28, borderRadius: 'var(--radius-pill)' }} aria-hidden="true" />
      </div>
      <style>
        {`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}
      </style>
    </div>
  );
}
