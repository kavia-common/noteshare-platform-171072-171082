import React, { useState, useEffect } from 'react';
import './App.css';
import { applyThemeToRoot } from './theme';
import Navbar from './components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import FloatingActionButton from './components/upload/FloatingActionButton';
import UploadModal from './components/upload/UploadModal';
import AuthModal from './components/auth/AuthModal';
import { useAuth } from './hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * App
 * Top-level app shell that manages theme and renders Navbar + routed content via Outlet.
 * Also provides a floating '+' FAB for uploads and manages Upload/Auth modal visibility.
 */
function App() {
  const [mode, setMode] = useState('light');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState('login');
  const { user } = useAuth();

  useEffect(() => {
    applyThemeToRoot(mode === 'dark');
  }, [mode]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const openUpload = () => setUploadOpen(true);
  const closeUpload = () => setUploadOpen(false);
  const openAuthLogin = () => {
    setAuthDefaultMode('login');
    setAuthOpen(true);
  };
  const closeAuth = () => setAuthOpen(false);

  return (
    <div className="App">
      <Navbar mode={mode} onToggleTheme={toggleTheme} />
      <Outlet />

      <FloatingActionButton
        onUploadClick={openUpload}
        onRequireAuth={openAuthLogin}
        visible={true}
      />

      <UploadModal
        open={uploadOpen && !!user}
        onClose={closeUpload}
        onSuccess={() => {
          // optional: navigate to profile or refresh view
        }}
      />

      <AuthModal open={authOpen} onClose={closeAuth} defaultMode={authDefaultMode} />
    </div>
  );
}

export default App;
