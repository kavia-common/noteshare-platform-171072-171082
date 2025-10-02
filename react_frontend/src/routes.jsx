import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './views/HomePage';
import BrowsePage from './views/BrowsePage';
import UploadPage from './views/UploadPage';
import ProfilePage from './views/ProfilePage';
import NotFoundPage from './views/NotFoundPage';
import NoteDetailPage from './views/NoteDetailPage';

/**
 * PUBLIC_INTERFACE
 * router
 * Main application router created with React Router v6.
 * Uses App as the root layout to provide Navbar, FAB, and global modals to all routes.
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'browse', element: <BrowsePage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'notes/:id', element: <NoteDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default router;
