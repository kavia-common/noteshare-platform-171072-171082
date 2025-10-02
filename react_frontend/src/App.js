import React, { useState, useEffect } from 'react';
import './App.css';
import { applyThemeToRoot } from './theme';
import Navbar from './components/layout/Navbar';
import { Outlet } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * App
 * Top-level app shell that manages theme and renders Navbar + routed content via Outlet.
 */
function App() {
  const [mode, setMode] = useState('light');

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
    </div>
  );
}

export default App;
