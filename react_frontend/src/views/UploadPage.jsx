import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import UploadModal from '../components/upload/UploadModal';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/auth/AuthModal';

export default function UploadPage() {
  const { user } = useAuth();
  const [open, setOpen] = React.useState(true);
  const [authOpen, setAuthOpen] = React.useState(!user);

  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Upload notes</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Choose a PDF file, add details, and upload it to share with the community.
          </p>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={() => (user ? setOpen(true) : setAuthOpen(true))}>
              Open Upload
            </Button>
          </div>
        </section>
      </Container>

      <UploadModal open={!!user && open} onClose={() => setOpen(false)} onSuccess={() => {}} />
      <AuthModal open={!user && authOpen} onClose={() => setAuthOpen(false)} defaultMode="login" />
    </main>
  );
}
