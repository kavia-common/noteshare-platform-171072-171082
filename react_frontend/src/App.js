import React, { useState, useEffect } from 'react';
import './App.css';
import { applyThemeToRoot } from './theme';
import Button from './components/common/Button';
import Input from './components/common/Input';
import Select from './components/common/Select';
import Badge from './components/common/Badge';

// PUBLIC_INTERFACE
function App() {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    applyThemeToRoot(mode === 'dark');
  }, [mode]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="container navbar-inner">
          <div className="brand">
            <span className="dot" />
            NoteShare
          </div>
          <div style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <Badge variant="primary" size="sm">Ocean Professional</Badge>
            <button
              className="icon-btn"
              aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {mode === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <main className="main">
        <div className="container">
          <section className="surface hero surface-animate">
            <div>
              <h1 className="hero-title">Share and discover high-quality notes</h1>
              <p className="hero-subtitle">Upload PDFs, browse categories, and download notes from the community.</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="primary">Upload</Button>
              <Button variant="outline">Browse</Button>
            </div>
          </section>

          <section style={{ marginTop: 24 }} className="surface surface-animate">
            <div style={{ padding: 18, borderBottom: '1px solid var(--color-border)' }}>
              <strong style={{ fontSize: 'var(--font-md)' }}>Quick Demo: Primitives</strong>
            </div>
            <div style={{ padding: 18, display: 'grid', gap: 16, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <div style={{ display: 'grid', gap: 10 }}>
                <Input id="search" label="Search notes" placeholder="Search by title, tags, or author..." />
                <Select id="category" label="Category" defaultValue="">
                  <option value="" disabled>Select a category</option>
                  <option value="math">Mathematics</option>
                  <option value="cs">Computer Science</option>
                  <option value="history">History</option>
                </Select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Badge variant="primary">New</Badge>
                  <Badge variant="success">Verified</Badge>
                  <Badge variant="warning">Popular</Badge>
                  <Badge variant="error">Flagged</Badge>
                  <Badge variant="neutral">General</Badge>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button size="sm" variant="secondary">Secondary</Button>
                  <Button size="sm" variant="outline">Outline</Button>
                  <Button size="sm" variant="danger">Danger</Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
