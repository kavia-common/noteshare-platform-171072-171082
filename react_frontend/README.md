# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify
- **Tag Chips & Multi-select**: Filter by multiple tags with keyboard-friendly chips UI
- **Google OAuth**: Login with Google via Supabase
- **Avatars**: Gravatar with initials fallback
- **PDF Page Count**: Client-side extraction with pdfjs
- **Analytics (optional)**: Best-effort view/download counters using a 'note_events' table if present

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Supabase Setup

We use Supabase for authentication, storage, and database access.

1) Install dependencies:
   ```
   npm install
   ```

2) Configure environment variables:
   - Copy `.env.sample` to `.env`
   - Fill in:
     - `REACT_APP_SUPABASE_URL`
     - `REACT_APP_SUPABASE_ANON_KEY`
     - Optionally `REACT_APP_SITE_URL` (used for auth email redirects)
   - Never commit `.env` (it is ignored by default).

3) Supabase client location:
   - `src/lib/supabaseClient.js`
   - Import usage examples:
     ```js
     import supabase from './lib/supabaseClient';
     // or named:
     import { getSupabaseClient } from './lib/supabaseClient';
     ```

4) Authentication UI
   - An `AuthModal` provides Login / Sign Up with email/password and "Continue with Google" (Supabase OAuth).
   - The `Navbar` shows Login/Sign Up if logged out, and avatar + email + Logout if logged in.
   - Session state is provided by `AuthProvider` and the `useAuth` hook.
   - Profile page shows current session info and a placeholder for user's notes.
   - Set `REACT_APP_SITE_URL` to your deployed origin to ensure correct redirect for OAuth/email links.

## Customization

### Colors

The main brand colors are defined at runtime via CSS variables using `src/theme.js`.

### Components

This template uses pure HTML/CSS components instead of a UI framework. You can find component styles in `src/App.css`. 

Common components include:
- Buttons (`.btn`, `.btn-large`)
- Container (`.container`)
- Navigation (`.navbar`)
- Typography (`.title`, `.subtitle`, `.description`)

## Learn More

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
