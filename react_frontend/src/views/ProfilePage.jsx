import React from 'react';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, session, loading, signOut } = useAuth();

  const onLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to logout', e);
    }
  };

  return (
    <main className="main">
      <Container>
        <section className="surface surface-animate" style={{ padding: 18, display: 'grid', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2 style={{ margin: 0 }}>Your profile</h2>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 6 }}>
                View your account info and recent uploads.
              </p>
            </div>
            <Badge variant="primary" size="sm">Ocean Professional</Badge>
          </div>

          {loading ? (
            <div style={{ color: 'var(--color-text-muted)' }} aria-live="polite">Loading session...</div>
          ) : user ? (
            <>
              <div className="surface" style={{ padding: 16 }}>
                <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 'var(--font-md)' }}>Account</h3>
                <div style={{ display: 'grid', gap: 8, fontSize: 'var(--font-sm)' }}>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>User ID:</strong> {user.id}</div>
                  <div><strong>Last sign-in:</strong> {session?.user?.last_sign_in_at || '—'}</div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <Button variant="outline" onClick={onLogout}>Logout</Button>
                </div>
              </div>

              <div className="surface" style={{ padding: 16 }}>
                <h3 style={{ marginTop: 0, marginBottom: 10, fontSize: 'var(--font-md)' }}>Your notes</h3>
                <p style={{ color: 'var(--color-text-muted)', marginTop: 0 }}>
                  Your uploaded notes will appear here. (Integration with storage/database coming soon.)
                </p>
              </div>
            </>
          ) : (
            <div className="surface" style={{ padding: 16 }}>
              <h3 style={{ marginTop: 0 }}>You are not signed in</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                Please use the Login or Sign Up buttons in the top-right to access your profile.
              </p>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
