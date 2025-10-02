import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" role="alert" aria-live="polite" style={{ padding: 24, display: 'grid', gap: 10 }}>
          <h2 style={{ margin: 0 }}>Page not found</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>The page you are looking for does not exist.</p>
          <div>
            <Button variant="outline" onClick={() => (window.location.href = '/')} aria-label="Go to home page">Go home</Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
