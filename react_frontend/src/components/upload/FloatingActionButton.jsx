import React from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * FloatingActionButton
 * Bottom-right '+' FAB. If user is authenticated, calls onUploadClick;
 * otherwise calls onRequireAuth (to open auth modal).
 * Props:
 *  - onUploadClick: function
 *  - onRequireAuth: function
 *  - visible: boolean (optional) to control overall visibility (defaults true)
 */
export default function FloatingActionButton({ onUploadClick, onRequireAuth, visible = true }) {
  const { user } = useAuth();

  if (!visible) return null;

  const handleClick = () => {
    if (user) onUploadClick?.();
    else onRequireAuth?.();
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 45,
      }}
    >
      <button
        aria-label="Upload note"
        title="Upload note"
        className="btn-reset"
        onClick={handleClick}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          color: '#fff',
          boxShadow: 'var(--shadow-lg)',
          border: 'none',
          cursor: 'pointer',
          transition: 'transform 120ms ease, box-shadow 200ms ease, filter 200ms ease',
          fontSize: 26,
          lineHeight: 1,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 28px rgba(2,6,23,0.18)';
          e.currentTarget.style.filter = 'saturate(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          e.currentTarget.style.filter = 'saturate(1)';
        }}
      >
        +
      </button>
    </div>
  );
}
