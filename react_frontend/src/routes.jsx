import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomePage from './views/HomePage';
import BrowsePage from './views/BrowsePage';
import UploadPage from './views/UploadPage';
import ProfilePage from './views/ProfilePage';
import NotFoundPage from './views/NotFoundPage';
import NoteDetailPage from './views/NoteDetailPage';

/**
 * PUBLIC_INTERFACE
 * router
 * Main application router created with React Router v6. Supports core app pages.
 */
const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  { path: '/browse', element: <BrowsePage /> },
  { path: '/upload', element: <UploadPage /> },
  { path: '/profile', element: <ProfilePage /> },
  { path: '/notes/:id', element: <NoteDetailPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default router;
