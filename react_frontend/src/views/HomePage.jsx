import React, { useEffect, useMemo, useState } from 'react';
import Button from '../components/common/Button';
import FiltersBar from '../components/common/FiltersBar';
import NoteCard from '../components/common/NoteCard';
import { fetchNotes } from '../lib/notesService';
import { useSearchFilters } from '../contexts/SearchFilterContext';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';

/**
 * PUBLIC_INTERFACE
 * HomePage
 * Main landing page featuring a hero, filters/search bar, note grid, and pagination.
 * Integrates with Supabase via notesService.fetchNotes.
 */
export default function HomePage() {
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const { search, category, tagsString, apply, reset } = useSearchFilters();
  const [notes, setNotes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPages = useMemo(() => Math.max(1, Math.ceil((count || 0) / PAGE_SIZE)), [count]);

  const parsedTags = useMemo(() => {
    const raw = tagsString || '';
    if (!raw.trim()) return [];
    return raw.split(',').map((t) => t.trim()).filter(Boolean);
  }, [tagsString]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data, count: total, error: err } = await fetchNotes({
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
        search,
        category,
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
  }, [page, search, category, tagsString]);

  const onApplyFilters = ({ search: s, category: c, tagsString: t }) => {
    setPage(1);
    apply({ search: s, category: c, tagsString: t });
  };

  const onOpen = (id) => {
    // Route to the dedicated Note Detail page
    window.location.href = `/notes/${id}`;
  };

  const onDownload = (_note) => {
    // Placeholder; Note Detail will implement signed URL download
    alert('Download coming soon in Note Detail view.');
  };

  const Pagination = () => (
    <div className="surface surface-animate" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }} aria-live="polite">
        {count} {count === 1 ? 'result' : 'results'} • Page {page} of {totalPages}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="outline" disabled={loading || page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Previous page">
          Previous
        </Button>
        <Button variant="primary" disabled={loading || page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-label="Next page">
          Next
        </Button>
      </div>
    </div>
  );

  const renderLoadingGrid = () => (
    <div className="grid grid-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <LoadingSkeleton key={i} variant="card" lines={4} ariaLabel="Loading note card" />
      ))}
    </div>
  );

  return (
    <>
      <section className="surface hero surface-animate">
        <div>
          <h1 className="hero-title">Share and discover high-quality notes</h1>
          <p className="hero-subtitle">Upload PDFs, browse categories, and download notes from the community.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={() => (window.location.href = '/upload')} aria-label="Open upload page">Upload</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/browse')} aria-label="Open browse page">Browse</Button>
        </div>
      </section>

      <FiltersBar initial={{ q: search, cat: category, tags: tagsString }} onApply={onApplyFilters} busy={loading} />

      <section style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        {error ? (
          <ErrorState
            title="We couldn’t load notes"
            message={error}
            onRetry={() => load()}
            secondary={{ label: 'Reset filters', onClick: () => { reset(); setPage(1); } }}
          />
        ) : null}

        {!error && loading ? renderLoadingGrid() : null}

        {!error && !loading && notes.length === 0 ? (
          <EmptyState
            title="No notes match your filters"
            description="Try adjusting search terms, selecting another category, or clearing tags."
            secondary={{
              label: 'Clear filters',
              onClick: () => { reset(); setPage(1); },
              ariaLabel: 'Clear filters',
            }}
            badge="Ocean Professional"
            icon="🌊"
          />
        ) : null}

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
    </>
  );
}
