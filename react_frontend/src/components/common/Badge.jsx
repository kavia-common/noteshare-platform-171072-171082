import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Badge
 * A small label used for statuses or categories with different color variants.
 */
export default function Badge({
  children,
  variant = 'info', // info | success | warning | error | neutral | primary
  size = 'md', // sm | md
  className = '',
  ...props
}) {
  const colors = {
    info: { bg: 'rgba(59,130,246,0.12)', fg: 'var(--color-info)', bd: 'rgba(59,130,246,0.35)' },
    success: { bg: 'rgba(16,185,129,0.12)', fg: '#10B981', bd: 'rgba(16,185,129,0.35)' },
    warning: { bg: 'rgba(245,158,11,0.12)', fg: 'var(--color-warning)', bd: 'rgba(245,158,11,0.35)' },
    error: { bg: 'rgba(239,68,68,0.12)', fg: 'var(--color-error)', bd: 'rgba(239,68,68,0.35)' },
    primary: { bg: 'rgba(37,99,235,0.12)', fg: 'var(--color-primary)', bd: 'rgba(37,99,235,0.35)' },
    neutral: { bg: 'rgba(107,114,128,0.12)', fg: 'var(--color-text-muted)', bd: 'rgba(107,114,128,0.35)' },
  };

  const sizes = {
    sm: { px: 8, py: 4, fs: 'var(--font-xs)', radius: 'var(--radius-sm)' },
    md: { px: 10, py: 6, fs: 'var(--font-sm)', radius: 'var(--radius-md)' },
  };

  const c = colors[variant] || colors.info;
  const s = sizes[size] || sizes.md;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: `${s.py}px ${s.px}px`,
    fontSize: s.fs,
    color: c.fg,
    background: c.bg,
    border: `1px solid ${c.bd}`,
    borderRadius: s.radius,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  };

  return (
    <span className={className} style={style} {...props}>
      {children}
    </span>
  );
}
