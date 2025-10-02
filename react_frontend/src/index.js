import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { applyThemeToRoot } from './theme';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { AuthProvider } from './hooks/useAuth';
import { UIProvider } from './contexts/UIContext';
import { SearchFilterProvider } from './contexts/SearchFilterContext';

// initialize theme variables on first load
applyThemeToRoot(false);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <UIProvider>
        <SearchFilterProvider>
          <RouterProvider router={router} />
        </SearchFilterProvider>
      </UIProvider>
    </AuthProvider>
  </React.StrictMode>
);
