import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';

export default function BrowsePage() {
  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 18, display: 'grid', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>Browse notes</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>
            Advanced browse with deep filtering will be implemented after Home grid.
          </p>
          <div>
            <Button variant="outline" onClick={() => (window.location.href = '/')} aria-label="Go back to home">Back to Home</Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
