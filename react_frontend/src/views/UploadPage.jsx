import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';

export default function UploadPage() {
  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Upload notes</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Upload form will go here. You will be able to select a PDF, set a title, category, and tags.</p>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" disabled>Choose file</Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
