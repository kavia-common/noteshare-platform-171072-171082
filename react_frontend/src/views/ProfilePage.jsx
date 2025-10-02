import React from 'react';
import Container from '../components/layout/Container';

export default function ProfilePage() {
  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Your profile</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Authentication info and your uploads will be shown here.</p>
        </section>
      </Container>
    </main>
  );
}
