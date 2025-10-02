import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { useAuth } from '../../hooks/useAuth';
import AuthModal from '../auth/AuthModal';

/**
 * PUBLIC_INTERFACE
 * Navbar
 * Top navigation bar featuring brand, search, category filter, upload CTA, and auth shortcuts.
 */
export default function Navbar({ mode = 'light', onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [authOpen, setAuthOpen] = React.useState(false);
  const [authDefaultMode, setAuthDefaultMode] = React.useState('login');

  const onSubmit = (e) => {
    e.preventDefault();
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

  const openLogin = () => {
    setAuthDefaultMode('login');
    setAuthOpen(true);
  };

  const openSignup = () => {
    setAuthDefaultMode('signup');
    setAuthOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
            <span className="dot" />
            NoteShare
          </Link>

          <form onSubmit={onSubmit} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flex: 1, maxWidth: 680 }}>
            <Input
              id="global-search"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search notes"
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
            <Button type="submit" variant="secondary">Search</Button>
          </form>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginLeft: 10 }}>
            <Badge variant="primary" size="sm">Ocean Professional</Badge>
            <Button variant={location.pathname === '/upload' ? 'primary' : 'outline'} onClick={() => navigate('/upload')}>
              Upload
            </Button>
            <Button variant="subtle" onClick={() => navigate('/profile')}>
              Profile
            </Button>

            {!user ? (
              <>
                <Button variant="outline" onClick={openLogin}>
                  Login
                </Button>
                <Button variant="primary" onClick={openSignup}>
                  Sign Up
                </Button>
              </>
            ) : (
              <>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-sm)' }}>
                  {user.email}
                </span>
                <Button variant="outline" onClick={handleLogout}>
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

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} defaultMode={authDefaultMode} />
    </>
  );
}
