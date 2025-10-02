import React from 'react';
import { theme } from '../../theme';

/**
 * PUBLIC_INTERFACE
 * Button
 * A reusable button component with size, variant, and fullWidth options.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leadingIcon = null,
  trailingIcon = null,
  className = '',
  disabled = false,
  ...props
}) {
  const sizeMap = {
    sm: { font: 'var(--font-sm)', py: '8px', px: '12px', radius: 'var(--radius-sm)' },
    md: { font: 'var(--font-md)', py: '10px', px: '16px', radius: 'var(--radius-md)' },
    lg: { font: 'var(--font-lg)', py: '12px', px: '20px', radius: 'var(--radius-lg)' },
  };
  const sizeDef = sizeMap[size] || sizeMap.md;

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: theme.typography.weights.semibold,
    borderRadius: sizeDef.radius,
    padding: `${sizeDef.py} ${sizeDef.px}`,
    fontSize: sizeDef.font,
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    userSelect: 'none',
    transition: 'transform 120ms ease, background 200ms ease, color 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
    border: '1px solid transparent',
    boxShadow: 'var(--shadow-sm)',
    lineHeight: 1.1
  };

  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: '#ffffff',
      borderColor: 'transparent',
    },
    secondary: {
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(37, 99, 235, 0.08))',
      color: 'var(--color-text)',
      borderColor: 'var(--color-border)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary)',
      borderColor: 'rgba(37,99,235,0.45)',
    },
    subtle: {
      background: 'var(--color-surface)',
      color: 'var(--color-text)',
      borderColor: 'var(--color-border)',
    },
    danger: {
      background: 'var(--color-error)',
      color: '#ffffff',
      borderColor: 'transparent',
    }
  };

  const style = { ...base, ...variants[variant] };

  const onMouseEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.transform = 'translateY(-1px)';
    if (variant === 'primary') {
      e.currentTarget.style.background = 'var(--color-primary-hover)';
    }
    if (variant === 'secondary') {
      e.currentTarget.style.borderColor = 'rgba(37,99,235,0.45)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }
  };

  const onMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    if (variant === 'primary') {
      e.currentTarget.style.background = 'var(--color-primary)';
    }
    if (variant === 'secondary') {
      e.currentTarget.style.borderColor = 'var(--color-border)';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }
  };

  return (
    <button
      className={`btn-reset ${className}`}
      style={style}
      disabled={disabled}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {leadingIcon ? <span aria-hidden="true">{leadingIcon}</span> : null}
      <span>{children}</span>
      {trailingIcon ? <span aria-hidden="true">{trailingIcon}</span> : null}
    </button>
  );
}
