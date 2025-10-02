import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import UploadModal from '../components/upload/UploadModal';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/auth/AuthModal';
import { useUI } from '../contexts/UIContext';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const { openAuth, authOpen, closeAuth, openUpload, uploadOpen, closeUpload } = useUI();

  React.useEffect(() => {
    // When entering upload page, auto-open the relevant modal based on auth state
    if (!loading) {
      if (user) openUpload();
      else openAuth('login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return (
    <main className="main">
      <Container>
        {loading ? (
          <section style={{ display: 'grid', gap: 12 }}>
            <LoadingSkeleton variant="card" lines={3} ariaLabel="Loading upload view" />
          </section>
        ) : (
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

            {!user ? (
              <div style={{ marginTop: 14 }}>
                <EmptyState
                  title="Sign in to upload"
                  description="You need to be authenticated to upload notes."
                  primaryAction={{ label: 'Login', onClick: () => openAuth('login') }}
                  secondaryAction={{ label: 'Sign Up', onClick: () => openAuth('signup') }}
                  icon="🔐"
                  badge="Ocean Professional"
                />
              </div>
            ) : null}
          </section>
        )}
      </Container>

      <UploadModal open={!!user && uploadOpen} onClose={closeUpload} onSuccess={() => {}} />
      <AuthModal open={!user && authOpen} onClose={closeAuth} defaultMode="login" />
    </main>
  );
}
