import React from 'react';
import Button from './Button';
import Badge from './Badge';

/**
 * PUBLIC_INTERFACE
 * NoteCard
 * Display a note summary card for the grid view.
 * Props:
 *  - note: { id, title, description, category, tags, created_at }
 *  - onOpen: (id) => void  // callback to open detail view (future integration)
 *  - onDownload: (note) => void // callback to trigger download (future integration)
 */
export default function NoteCard({ note, onOpen, onDownload }) {
  const { id, title, description, category, tags = [], created_at } = note || {};

  const goOpen = () => {
    if (onOpen) return onOpen(id);
    // default navigation to detail route
    if (id) window.location.href = `/notes/${id}`;
  };

  const cardTitle = title || 'Untitled';

  return (
    <article
      className="surface surface-animate"
      aria-labelledby={`note-card-${id}-title`}
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        padding: 14,
        minHeight: 160,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <h3 id={`note-card-${id}-title`} style={{ margin: 0, fontSize: 'var(--font-md)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {cardTitle}
        </h3>
        {category ? <Badge variant="neutral" size="sm">{category}</Badge> : null}
      </div>

      <p
        style={{
          marginTop: 8,
          marginBottom: 10,
          color: 'var(--color-text-muted)',
          fontSize: 'var(--font-sm)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
        title={description || ''}
      >
        {description || 'No description provided.'}
      </p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {(tags || []).slice(0, 3).map((t) => (
            <Badge key={t} size="sm" variant="info">{t}</Badge>
          ))}
          {Array.isArray(tags) && tags.length > 3 ? (
            <Badge size="sm" variant="neutral">+{tags.length - 3}</Badge>
          ) : null}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="outline" size="sm" onClick={goOpen} aria-label={`Open ${cardTitle}`} title="Open note">Open</Button>
          <Button variant="primary" size="sm" onClick={() => onDownload?.(note)} aria-label={`Download ${cardTitle}`} title="Download note">Download</Button>
        </div>
      </div>

      {created_at ? (
        <div style={{ marginTop: 8, color: 'var(--color-text-muted)', fontSize: 'var(--font-xs)' }}>
          Added {new Date(created_at).toLocaleDateString()}
        </div>
      ) : null}
    </article>
  );
}
