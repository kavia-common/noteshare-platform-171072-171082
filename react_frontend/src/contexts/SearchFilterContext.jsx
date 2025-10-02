import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchFilterProvider
 * Provides global search/filter state that can be shared across Navbar, Home, and Browse.
 * Exposes:
 *  - search: string
 *  - category: string
 *  - tagsString: string
 *  - setSearch(v), setCategory(v), setTagsString(v)
 *  - apply({search, category, tagsString}), reset()
 */
const SearchFilterContext = createContext(null);

// PUBLIC_INTERFACE
export function SearchFilterProvider({ children }) {
  /** Global search/filter state with helper actions. */
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [tagsString, setTagsString] = useState('');

  // PUBLIC_INTERFACE
  const apply = useCallback(({ search: s = '', category: c = '', tagsString: t = '' }) => {
    setSearch(s);
    setCategory(c);
    setTagsString(t);
  }, []);

  // PUBLIC_INTERFACE
  const reset = useCallback(() => {
    setSearch('');
    setCategory('');
    setTagsString('');
  }, []);

  const value = useMemo(
    () => ({
      search,
      category,
      tagsString,
      setSearch,
      setCategory,
      setTagsString,
      apply,
      reset,
    }),
    [search, category, tagsString, apply, reset]
  );

  return <SearchFilterContext.Provider value={value}>{children}</SearchFilterContext.Provider>;
}

// PUBLIC_INTERFACE
export function useSearchFilters() {
  /** Access search/filter global state. */
  const ctx = useContext(SearchFilterContext);
  if (!ctx) throw new Error('useSearchFilters must be used within a SearchFilterProvider');
  return ctx;
}
