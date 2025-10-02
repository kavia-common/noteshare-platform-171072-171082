import React, { useEffect, useMemo, useState } from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import FiltersBar from '../components/common/FiltersBar';
import NoteCard from '../components/common/NoteCard';
import { fetchNotes } from '../lib/notesService';

/**
 * PUBLIC_INTERFACE
 * HomePage
 * Main landing page featuring a hero, filters/search bar, note grid, and pagination.
 * Integrates with Supabase via notesService.fetchNotes.
 */
export default function HomePage() {
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState({ search: '', category: '', tagsString: '' });
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPages = useMemo(() => Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)), [count]);

  const parsedTags = useMemo(() => {
    const raw = query.tagsString || '';
    if (!raw.trim()) return [];
    return raw.split(',').map((t) => t.trim()).filter(Boolean);
  }, [query.tagsString]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, count: total, error: err } = await fetchNotes({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        search: query.search,
        category: query.category,
        tags: parsedTags,
      });
      if (err) {
        setError(err);
        setNotes([]);
        setCount(0);
      } else {
        setNotes(data);
        setCount(total);
      }
    } catch (ex) {
      setError(ex?.message || 'Failed to load notes.');
      setNotes([]);
      setCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query.search, query.category, query.tagsString]);

  const onApplyFilters = ({ search, category, tagsString }) => {
    setPage(1);
    setQuery({ search, category, tagsString });
  };

  const onOpen = (id) => {
    // Future: route to detail page
    window.location.href = `/browse?open=${id}`;
  };

  const onDownload = (_note) => {
    // Placeholder; Note Detail will implement signed URL download
    alert('Download coming soon in Note Detail view.');
  };

  const EmptyState = () => (
    <div className="surface surface-animate" style={{ padding: 18, textAlign: 'center' }}>
      <h3 style={{ marginTop: 0 }}>No notes match your filters</h3>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 6 }}>
        Try adjusting search terms, selecting another category, or clearing tags.
      </p>
      <div style={{ marginTop: 10 }}>
        <Button variant="outline" onClick={() => { setQuery({ search: '', category: '', tagsString: '' }); setPage(1); }}>
          Clear filters
        </Button>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="surface surface-animate" role="alert" style={{ padding: 18, borderColor: 'rgba(239,68,68,0.35)' }}>
      <h3 style={{ marginTop: 0, color: 'var(--color-error)' }}>We couldn’t load notes</h3>
      <p style={{ color: 'var(--color-text-muted)' }}>{error}</p>
      <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
        <Button variant="outline" onClick={() => load()}>Retry</Button>
        <Button variant="subtle" onClick={() => { setQuery({ search: '', category: '', tagsString: '' }); setPage(1); }}>
          Reset filters
        </Button>
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="surface surface-animate" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>
        {count} {count === 1 ? 'result' : 'results'} • Page {page} of {totalPages}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" disabled={loading || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Previous
        </Button>
        <Button variant="primary" disabled={loading || page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          Next
        </Button>
      </div>
    </div>
  );

  return (
    <main className="main">
      <Container>
        <section className="surface hero surface-animate">
          <div>
            <h1 className="hero-title">Share and discover high-quality notes</h1>
            <p className="hero-subtitle">Upload PDFs, browse categories, and download notes from the community.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={() => (window.location.href = '/upload')}>Upload</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/browse')}>Browse</Button>
          </div>
        </section>

        <FiltersBar initial={{ q: '', cat: '', tags: '' }} onApply={onApplyFilters} busy={loading} />

        <section style={{ marginTop: 16, display: 'grid', gap: 12 }}>
          {error ? <ErrorState /> : null}

          {!error && loading ? (
            <div className="surface surface-animate" style={{ padding: 18 }}>
              <div style={{ marginBottom: 6, fontSize: 'var(--font-sm)', color: 'var(--color-text-muted)' }}>
                Loading notes...
              </div>
              <div style={{ height: 8, background: 'rgba(59,130,246,0.12)', borderRadius: 999 }}>
                <div
                  style={{
                    width: '60%',
                    height: '100%',
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                    transition: 'width 300ms ease',
                  }}
                />
              </div>
            </div>
          ) : null}

          {!error && !loading && notes.length === 0 ? <EmptyState /> : null}

          {!error && !loading && notes.length > 0 ? (
            <>
              <div className="grid grid-3">
                {notes.map((n) => (
                  <NoteCard key={n.id} note={n} onOpen={onOpen} onDownload={onDownload} />
                ))}
              </div>
              <Pagination />
            </>
          ) : null}
        </section>
      </Container>
    </main>
  );
}
