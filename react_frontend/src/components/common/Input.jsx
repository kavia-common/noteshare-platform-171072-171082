import React, { forwardRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * Input
 * A text input with label, help text and error support.
 */
function InputBase({
  label,
  id,
  helpText,
  error,
  className = '',
  type = 'text',
  autoComplete,
  ...props
}, ref) {
  const inputStyle = {
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
  };

  const onFocus = (e) => {
    e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
    e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'rgba(37,99,235,0.6)';
  };

  const onBlur = (e) => {
    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    e.currentTarget.style.borderColor = error ? 'var(--color-error)' : 'var(--color-border)';
  };

  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`input-field ${className}`} style={{ width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{ display: 'block', fontSize: 'var(--font-sm)', marginBottom: 6, color: 'var(--color-text)' }}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        type={type}
        style={inputStyle}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        autoComplete={autoComplete}
        {...props}
      />
      {helpText && !error && (
        <div id={helpId} style={{ marginTop: 6, fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>{helpText}</div>
      )}
      {error && (
        <div id={errorId} role="alert" style={{ marginTop: 6, fontSize: 'var(--font-xs)', color: 'var(--color-error)' }}>{error}</div>
      )}
    </div>
  );
}

const Input = forwardRef(InputBase);
export default Input;
