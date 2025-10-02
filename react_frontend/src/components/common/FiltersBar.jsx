import React, { useEffect, useState } from 'react';
import Input from './Input';
import Select from './Select';
import Button from './Button';
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

  const submit = (e) => {
    e?.preventDefault?.();
    onApply?.({
      search: q.trim(),
      category: cat.trim(),
      tagsString: tagsString.trim(),
    });
  };

  return (
    <form onSubmit={submit} className="surface surface-animate" style={{ padding: 14, display: 'grid', gap: 10 }}>
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
        <Input
          id="home-tags"
          label="Tags"
          placeholder="Comma-separated, e.g., algebra, proofs"
          value={tagsString}
          onChange={(e) => setTagsString(e.target.value)}
          disabled={busy}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button type="button" variant="subtle" onClick={() => { setQ(''); setCat(''); setTagsString(''); }} disabled={busy}>
          Reset
        </Button>
        <Button type="submit" variant="primary" disabled={busy}>
          Apply
        </Button>
      </div>
    </form>
  );
}
