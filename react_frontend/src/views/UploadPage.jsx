import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import UploadModal from '../components/upload/UploadModal';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/auth/AuthModal';
import { useUI } from '../contexts/UIContext';

export default function UploadPage() {
  const { user } = useAuth();
  const { openAuth, authOpen, closeAuth, openUpload, uploadOpen, closeUpload } = useUI();

  React.useEffect(() => {
    // When entering upload page, auto-open the relevant modal based on auth state
    if (user) openUpload();
    else openAuth('login');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 18 }}>
          <h2 style={{ marginTop: 0 }}>Upload notes</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>
            Choose a PDF file, add details, and upload it to share with the community.
          </p>
          <div style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={() => (user ? openUpload() : openAuth('login'))}>
              Open Upload
            </Button>
          </div>
        </section>
      </Container>

      <UploadModal open={!!user && uploadOpen} onClose={closeUpload} onSuccess={() => {}} />
      <AuthModal open={!user && authOpen} onClose={closeAuth} defaultMode="login" />
    </main>
  );
}
