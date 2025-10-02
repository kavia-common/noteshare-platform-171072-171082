import React from 'react';
import Container from '../components/layout/Container';

export default function BrowsePage() {
  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 18 }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-lg)' }}>Browse notes</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Search and filter to find the notes you need. Grid and card layout will appear here.</p>
        </section>
      </Container>
    </main>
  );
}
