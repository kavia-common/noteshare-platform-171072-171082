import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Container
 * A layout wrapper that centers content with a max width and horizontal padding.
 */
export default function Container({ children, className = '', style }) {
  return (
    <div className={`container ${className}`} style={style}>
      {children}
    </div>
  );
}
