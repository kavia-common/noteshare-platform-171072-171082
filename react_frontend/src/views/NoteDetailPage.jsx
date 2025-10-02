import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '../components/layout/Container';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { deleteNote, fetchNoteById, getSignedUrl } from '../lib/notesService';
import { useAuth } from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * NoteDetailPage
 * Displays a single note's details including title, description, category, tags, owner info,
 * created date, file size, and an embedded PDF preview using a Supabase signed URL.
 * Provides a Download button (signed URL). If the current user owns the note,
 * shows Edit/Delete actions. Responsive:
 *  - Desktop: content + side panel layout
 *  - Mobile: actions open in a modal-like panel, preview stacked.
 */
export default function NoteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [signedUrl, setSignedUrl] = useState('');
  const [signError, setSignError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Extract bucket/path from file_path which may be stored as "bucket/path/in/bucket.pdf"
  const pathParts = useMemo(() => {
    const fp = note?.file_path || '';
    if (!fp.includes('/')) return { bucket: '', path: '' };
    const [bucket, ...rest] = fp.split('/');
    return { bucket, path: rest.join('/') };
  }, [note]);

  const isOwner = !!(user && note && note.user_id && user.id === note.user_id);

  const loadNote = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const { data, error } = await fetchNoteById(id);
      if (error) {
        setLoadError(error);
        setNote(null);
      } else {
        setNote(data);
      }
    } catch (e) {
      setLoadError(e?.message || 'Failed to load note');
      setNote(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch note on mount/id change
  useEffect(() => {
    if (id) loadNote();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Get signed URL for preview
  const createSigned = async () => {
    setSignError('');
    setSignedUrl('');
    if (!pathParts.bucket || !pathParts.path) return;
    const { signedUrl: url, error } = await getSignedUrl({
      bucket: pathParts.bucket,
      path: pathParts.path,
      expiresIn: 60, // short-lived for security
    });
    if (error) {
      setSignError(error);
      return;
    }
    setSignedUrl(url || '');
  };

  useEffect(() => {
    if (note) {
      createSigned();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note?.file_path]);

  const refreshSigned = () => {
    createSigned();
  };

  const onDownload = async () => {
    // Create a fresh signed URL to ensure it's valid for download
    try {
      setDownloading(true);
      const { signedUrl: url, error } = await getSignedUrl({
        bucket: pathParts.bucket,
        path: pathParts.path,
        expiresIn: 60,
      });
      if (error || !url) {
        alert(error || 'Unable to generate download link');
        setDownloading(false);
        return;
      }
      // Use a hidden anchor to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = note?.title ? `${note.title}.pdf` : 'note.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setDownloading(false);
    }
  };

  const onEdit = () => {
    // Placeholder: Navigates to a hypothetical edit page when implemented.
    alert('Edit functionality will be implemented later.');
  };

  const onDelete = async () => {
    if (!isOwner) return;
    const confirm = window.confirm('Delete this note? This cannot be undone.');
    if (!confirm) return;
    setDeleting(true);
    try {
      const { success, error } = await deleteNote(id);
      if (!success) {
        alert(error || 'Failed to delete');
      } else {
        navigate('/browse');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Layout helpers
  const MetaItem = ({ label, value, children }) => (
    <div style={{ display: 'grid', gap: 4 }}>
      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>{label}</div>
      <div style={{ fontSize: 'var(--font-sm)' }}>{children || value || '—'}</div>
    </div>
  );

  const Tags = ({ list }) => {
    if (!Array.isArray(list) || list.length === 0) return <span style={{ color: 'var(--color-text-muted)' }}>No tags</span>;
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {list.map((t) => (
          <Badge key={t} variant="info" size="sm">{t}</Badge>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <main className="main">
        <Container>
          <section className="surface surface-animate" style={{ padding: 18 }}>
            <div style={{ marginBottom: 6, fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
              Loading note...
            </div>
            <div style={{ height: 8, background: 'rgba(59,130,246,0.12)', borderRadius: 999 }}>
              <div
                style={{
                  width: '55%',
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                  transition: 'width 300ms ease',
                }}
              />
            </div>
          </section>
        </Container>
      </main>
    );
  }

  if (loadError || !note) {
    return (
      <main className="main">
        <Container>
          <section className="surface surface-animate" role="alert" style={{ padding: 18, borderColor: 'rgba(239,68,68,0.35)' }}>
            <h2 style={{ marginTop: 0, color: 'var(--color-error)' }}>Could not load note</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>{loadError || 'Unknown error'}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" onClick={() => loadNote()}>Retry</Button>
              <Button variant="subtle" onClick={() => navigate('/browse')}>Back to Browse</Button>
            </div>
          </section>
        </Container>
      </main>
    );
  }

  const created = note.created_at ? new Date(note.created_at).toLocaleString() : '—';
  const fileSizeText = typeof note.file_size === 'number' && note.file_size >= 0
    ? `${Math.round(note.file_size / 1024)} KB`
    : '—';

  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 14 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ margin: 0 }}>{note.title || 'Untitled'}</h2>
                {note.category ? <Badge variant="neutral" size="sm">{note.category}</Badge> : null}
              </div>
              {note.description ? (
                <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>{note.description}</p>
              ) : null}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline" onClick={() => navigate('/browse')}>Back</Button>
              <Button variant="primary" onClick={onDownload} disabled={downloading}>
                {downloading ? 'Preparing…' : 'Download'}
              </Button>
            </div>
          </div>

          {/* Responsive layout: preview + side panel */}
          <div className="grid" style={{ marginTop: 14, gridTemplateColumns: '2fr 1fr' }}>
            {/* PDF Preview */}
            <div className="surface" style={{ padding: 10, minHeight: 480 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>Preview</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button variant="subtle" size="sm" onClick={refreshSigned}>Refresh link</Button>
                  <Button variant="outline" size="sm" onClick={onDownload}>Open in new tab</Button>
                </div>
              </div>

              {signError ? (
                <div className="surface" role="alert" style={{ padding: 10, borderColor: 'rgba(239,68,68,0.35)' }}>
                  <div style={{ color: 'var(--color-error)' }}>Preview unavailable</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>{signError}</div>
                </div>
              ) : signedUrl ? (
                <div style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                  {/* Using object for better PDF handling fallback */}
                  <object
                    data={signedUrl}
                    type="application/pdf"
                    width="100%"
                    height="640px"
                  >
                    <iframe title="PDF preview" src={signedUrl} width="100%" height="640px" style={{ border: 'none' }}>
                      {/* Fallback content */}
                      <p>Your browser does not support embedded PDFs. <a href={signedUrl} target="_blank" rel="noreferrer">Open the PDF</a>.</p>
                    </iframe>
                  </object>
                </div>
              ) : (
                <div className="surface" style={{ padding: 10 }}>
                  <div style={{ marginBottom: 6, fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                    Generating secure preview link...
                  </div>
                  <div style={{ height: 8, background: 'rgba(59,130,246,0.12)', borderRadius: 999 }}>
                    <div
                      style={{
                        width: '45%',
                        height: '100%',
                        borderRadius: 999,
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                        transition: 'width 300ms ease',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Side panel */}
            <aside className="surface" style={{ padding: 12 }}>
              <h3 style={{ marginTop: 2, marginBottom: 8, fontSize: 'var(--font-md)' }}>Details</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                <MetaItem label="Owner">
                  <span>{note.user_email || note.owner_email || 'Owner hidden'}</span>
                </MetaItem>
                <MetaItem label="Created at" value={created} />
                <MetaItem label="File size" value={fileSizeText} />
                <MetaItem label="Pages" value={note.page_count || '—'} />
                <MetaItem label="Category" value={note.category || '—'} />
                <MetaItem label="Tags">
                  <Tags list={note.tags || []} />
                </MetaItem>
              </div>

              <div style={{ marginTop: 14, display: 'grid', gap: 8 }}>
                <Button variant="primary" onClick={onDownload} disabled={downloading}>
                  {downloading ? 'Preparing…' : 'Download'}
                </Button>
                {isOwner ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="subtle" onClick={onEdit}>Edit</Button>
                    <Button variant="danger" onClick={onDelete} disabled={deleting}>
                      {deleting ? 'Deleting…' : 'Delete'}
                    </Button>
                  </div>
                ) : null}
              </div>
            </aside>
          </div>

          {/* Mobile modal-like actions panel */}
          <div
            className="surface"
            style={{
              display: 'none',
              padding: 10,
              marginTop: 12,
            }}
          >
            {/* This block can be toggled via CSS media queries; as a simple approach we keep desktop above. */}
          </div>
        </section>
      </Container>

      <style>
        {`
          @media (max-width: 900px) {
            /* Stack preview and side panel on mobile */
            .surface-animate + .grid, section .grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </main>
  );
}
