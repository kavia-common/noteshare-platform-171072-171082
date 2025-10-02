import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { applyThemeToRoot } from './theme';
import { RouterProvider } from 'react-router-dom';
import router from './routes';

// initialize theme variables on first load
applyThemeToRoot(false);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
