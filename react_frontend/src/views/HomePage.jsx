import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';

export default function HomePage() {
  return (
    <main className="main">
      <Container>
        <section className="surface hero surface-animate">
          <div>
            <h1 className="hero-title">Share and discover high-quality notes</h1>
            <p className="hero-subtitle">Upload PDFs, browse categories, and download notes from the community.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={() => (window.location.href = '/upload')}>Upload</Button>
            <Button variant="outline" onClick={() => (window.location.href = '/browse')}>Browse</Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
