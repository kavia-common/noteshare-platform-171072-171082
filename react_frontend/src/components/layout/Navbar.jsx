import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Avatar from '../common/Avatar';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../contexts/UIContext';
import { useSearchFilters } from '../../contexts/SearchFilterContext';

/**
 * PUBLIC_INTERFACE
 * Navbar
 * Top navigation bar featuring brand, search, category filter, upload CTA, and auth shortcuts.
 */
export default function Navbar({ mode = 'light', onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { openAuth, openUpload } = useUI();
  const { search, setSearch, category, setCategory, apply } = useSearchFilters();

  const onSubmit = (e) => {
    e.preventDefault();
    // Apply to global state and navigate to browse
    apply({ search, category, tagsString: '' });
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (category) params.set('cat', category);
    navigate(`/browse?${params.toString()}`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Logout failed', e);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Primary">
      <div className="container navbar-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }} aria-label="Go to home">
          <span className="dot" />
          NoteShare
        </Link>

        <form
          onSubmit={onSubmit}
          role="search"
          aria-label="Search notes form"
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 680 }}
        >
          <Input
            id="global-search"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search notes"
            autoComplete="off"
            style={{ flex: 1 }}
          />
          <Select
            id="global-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            style={{ width: 220 }}
          >
            <option value="">All categories</option>
            <option value="math">Mathematics</option>
            <option value="cs">Computer Science</option>
            <option value="history">History</option>
            <option value="biology">Biology</option>
          </Select>
          <Button type="submit" variant="secondary" aria-label="Run search">Search</Button>
        </form>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginLeft: 10 }}>
          <Badge variant="primary" size="sm">Ocean Professional</Badge>
          <Button
            variant={location.pathname === '/upload' ? 'primary' : 'outline'}
            aria-label="Upload a note"
            onClick={() => {
              if (!user) {
                openAuth('login');
              } else {
                openUpload();
              }
            }}
          >
            Upload
          </Button>
          <Button variant="subtle" onClick={() => navigate('/profile')} aria-label="View profile">
            Profile
          </Button>

          {!user ? (
            <>
              <Button variant="outline" onClick={() => openAuth('login')} aria-label="Login">
                Login
              </Button>
              <Button variant="primary" onClick={() => openAuth('signup')} aria-label="Sign up">
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <Avatar email={user.email} name={user.user_metadata?.full_name} size={28} ariaLabel="User avatar" />
              <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }} aria-live="polite">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleLogout} aria-label="Logout">
                Logout
              </Button>
            </>
          )}

          <button
            className="icon-btn"
            aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
            onClick={onToggleTheme}
            title="Toggle theme"
          >
            {mode === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}
