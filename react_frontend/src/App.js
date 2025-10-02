import React, { useState, useEffect } from 'react';
import './App.css';
import { applyThemeToRoot } from './theme';
import Navbar from './components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import FloatingActionButton from './components/upload/FloatingActionButton';
import UploadModal from './components/upload/UploadModal';
import AuthModal from './components/auth/AuthModal';
import { useAuth } from './hooks/useAuth';
import { useUI } from './contexts/UIContext';

/**
 * PUBLIC_INTERFACE
 * App
 * Top-level app shell that manages theme and renders Navbar + routed content via Outlet.
 * Also provides a floating '+' FAB for uploads and manages Upload/Auth modal visibility.
 */
function App() {
  const [mode, setMode] = useState('light');
  const { user } = useAuth();
  const {
    uploadOpen,
    openUpload,
    closeUpload,
    authOpen,
    authDefaultMode,
    openAuth,
    closeAuth,
  } = useUI();

  useEffect(() => {
    applyThemeToRoot(mode === 'dark');
  }, [mode]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <Navbar mode={mode} onToggleTheme={toggleTheme} />
      <Outlet />

      <FloatingActionButton
        onUploadClick={openUpload}
        onRequireAuth={() => openAuth('login')}
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
