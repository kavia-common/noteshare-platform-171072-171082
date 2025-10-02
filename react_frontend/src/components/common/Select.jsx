import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Select
 * A themed select component with label and error states.
 */
export default function Select({
  label,
  id,
  helpText,
  error,
  className = '',
  children,
  ...props
}) {
  const baseStyle = {
    width: '100%',
    background: 'var(--color-surface)',
    color: 'var(--color-text)',
    border: `1px solid ${error ? 'var(--color-error)' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    fontSize: 'var(--font-md)',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease',
    outline: 'none',
    boxShadow: 'var(--shadow-sm)',
    appearance: 'none'
  };

  const onFocus = (e) => {
    e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
    e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'rgba(37,99,235,0.6)';
  };

  const onBlur = (e) => {
    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
  };

  return (
    <div className={`select-field ${className}`} style={{ width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', fontSize: 'var(--font-sm)', marginBottom: 6, color: 'var(--color-text)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select id={id} style={baseStyle} onFocus={onFocus} onBlur={onBlur} {...props}>
          {children}
        </select>
        {/* Chevron indicator */}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none',
            fontSize: 16
          }}
        >
          ▾
        </span>
      </div>
      {helpText && !error && (
        <div style={{ marginTop: 6, fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>{helpText}</div>
      )}
      {error && (
        <div role="alert" style={{ marginTop: 6, fontSize: 'var(--font-xs)', color: 'var(--color-error)' }}>{error}</div>
      )}
    </div>
  );
}
