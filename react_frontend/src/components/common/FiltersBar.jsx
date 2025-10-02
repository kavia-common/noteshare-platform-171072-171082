import React, { useEffect, useRef, useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
import Badge from './Badge';
import { listCategories } from '../../lib/notesService';

/**
 * PUBLIC_INTERFACE
 * FiltersBar
 * Search and filter controls for the home/browse grid.
 * Props:
 *  - initial: { q?: string, cat?: string, tags?: string }
 *  - onApply: ({ search, category, tagsString }) => void
 *  - busy: boolean (optional) disables controls while loading
 */
export default function FiltersBar({ initial = {}, onApply, busy = false }) {
  const [q, setQ] = useState(initial.q || '');
  const [cat, setCat] = useState(initial.cat || '');
  const [tagsString, setTagsString] = useState(initial.tags || '');
  const [categories, setCategories] = useState(['math', 'cs', 'history', 'biology']);
  const [loadingCats, setLoadingCats] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(() => {
    const raw = initial.tags || '';
    if (!raw.trim()) return [];
    return raw.split(',').map(t => t.trim()).filter(Boolean);
  });
  const tagInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const loadCats = async () => {
      setLoadingCats(true);
      const { data, error } = await listCategories();
      if (!mounted) return;
      if (!error && Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
      setLoadingCats(false);
    };
    loadCats();
    return () => { mounted = false; };
  }, []);

  const addTag = (val) => {
    const clean = (val || '').trim();
    if (!clean) return;
    if (!tags.includes(clean)) {
      const next = [...tags, clean];
      setTags(next);
      setTagsString(next.join(', '));
    }
    setTagInput('');
  };

  const removeTag = (t) => {
    const next = tags.filter(x => x !== t);
    setTags(next);
    setTagsString(next.join(', '));
    tagInputRef.current?.focus?.();
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' ) {
      e.preventDefault();
      addTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput) {
      // remove last
      if (tags.length > 0) removeTag(tags[tags.length - 1]);
    }
  };

  const submit = (e) => {
    e?.preventDefault?.();
    onApply?.({
      search: q.trim(),
      category: cat.trim(),
      tagsString: (tagsString || '').trim(),
    });
  };

  return (
    <form onSubmit={submit} className="surface surface-animate" aria-label="Filters" style={{ padding: 14, display: 'grid', gap: 10 }}>
      <div className="grid grid-3">
        <Input
          id="home-q"
          label="Search"
          placeholder="Search title or description"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={busy}
        />
        <Select
          id="home-cat"
          label="Category"
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          disabled={busy || loadingCats}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </Select>
        <div>
          <label htmlFor="home-tags" style={{ display: 'block', fontSize: 'var(--font-sm)', marginBottom: 6, color: 'var(--color-text)' }}>
            Tags
          </label>
          <div
            id="home-tags"
            role="group"
            aria-label="Add tags"
            className="surface"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexWrap: 'wrap',
              minHeight: 44,
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            {tags.map((t) => (
              <span key={t} className="surface" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 'var(--radius-pill)', border: '1px solid rgba(37,99,235,0.35)', background: 'rgba(37,99,235,0.08)', color: 'var(--color-text)' }}>
                <Badge variant="info" size="sm">{t}</Badge>
                <button
                  className="icon-btn"
                  aria-label={`Remove tag ${t}`}
                  type="button"
                  onClick={() => removeTag(t)}
                  title="Remove tag"
                  style={{ width: 24, height: 24 }}
                  disabled={busy}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              ref={tagInputRef}
              type="text"
              inputMode="text"
              placeholder={tags.length ? 'Add tag…' : 'Type and press Enter'}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={() => addTag(tagInput)}
              disabled={busy}
              aria-label="Tag input"
              style={{
                flex: 1,
                minWidth: 120,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: 'var(--color-text)',
                fontSize: 'var(--font-md)',
                padding: '6px 8px',
              }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
            Press Enter or comma to add a tag. Use Backspace to remove last tag.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button type="button" variant="subtle" onClick={() => { setQ(''); setCat(''); setTagsString(''); }} disabled={busy} aria-label="Reset filters">
          Reset
        </Button>
        <Button type="submit" variant="primary" disabled={busy} aria-label="Apply filters">
          Apply
        </Button>
      </div>
    </form>
  );
}
