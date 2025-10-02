# NoteShare Platform (Frontend + Supabase)

## Introduction

NoteShare is a web application for uploading, browsing, previewing, and downloading PDF notes. The frontend is a modern React application (Ocean Professional theme) that integrates with Supabase for Authentication, Database, and Storage.

This README documents local setup, environment configuration, Supabase integration (Auth, Storage, Schema/RLS), Google OAuth, optional analytics, and developer onboarding.

## Project Structure

- react_frontend/ — React app (Create React App + React Router 6)
  - src/lib/supabaseClient.js — Supabase client (singleton)
  - src/lib/notesService.js — Data-access layer for notes and events
  - src/hooks/useAuth.js — Authentication context and actions
  - src/views/* — Pages (Home, Browse, Upload, Profile, Note Detail)
  - src/components/* — UI components and modals
  - src/contexts/* — UI and filter contexts
  - src/theme.js — Theme tokens and CSS variables

## Quick Start

1) Install dependencies
   - cd react_frontend
   - npm install

2) Environment variables
   - Copy react_frontend/.env.sample to react_frontend/.env
   - Populate:
     - REACT_APP_SUPABASE_URL
     - REACT_APP_SUPABASE_ANON_KEY
     - REACT_APP_SITE_URL (recommended in production; used for email redirects and Google OAuth)
   - Do not commit .env

3) Run the app
   - cd react_frontend && npm start
   - Open http://localhost:3000

## Supabase Integration

The frontend uses:
- Auth: Email/password and Google OAuth (via Supabase)
- Database: notes table (plus optional note_events for analytics)
- Storage: notes bucket to store uploaded PDFs

Supabase client initialization:
- File: react_frontend/src/lib/supabaseClient.js
- Reads REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY

### Required Environment Variables

- REACT_APP_SUPABASE_URL: Your Supabase project URL
- REACT_APP_SUPABASE_ANON_KEY: Public anon key
- REACT_APP_SITE_URL: Base site URL used in auth redirects (e.g., http://localhost:3000 in dev; https://yourdomain.com in prod)

### Google OAuth Setup

1) In Supabase Dashboard:
   - Authentication -> URL Configuration
     - Site URL: set to your REACT_APP_SITE_URL
     - Additional Redirect URLs: include your dev and prod URLs if needed
   - Authentication -> Providers -> Google
     - Enable Google
     - Provide Client ID and Client Secret (from Google Cloud console)

2) Frontend usage:
   - useAuth.signInWithGoogle() triggers Supabase OAuth
   - Redirects back to REACT_APP_SITE_URL

### Storage Bucket and Policies

- Create a Storage bucket named notes
- File path convention: notes/{user_id}/{unique_name}.pdf (UploadModal enforces user foldering and unique names)

Recommended Storage policies (adjust to your security needs):
- Allow authenticated users to upload to notes in their own folder path = auth.uid()/*
- Allow downloads if user has row access to the related notes record (or make reads public if desired)
- Use signed URLs for preview/download (NoteDetailPage)

### Database Schema (Minimum)

Create table notes (example SQL):

- id uuid primary key default gen_random_uuid()
- user_id uuid not null references auth.users(id)
- title text not null
- description text
- category text
- tags text[] not null default '{}'::text[]
- file_path text not null  -- e.g., 'notes/{user_id}/{file}.pdf'
- file_size bigint
- page_count int
- created_at timestamptz default now()

Optional analytics:
- note_events table with columns: id uuid pk, note_id uuid, type text check (type in ('view','download')), created_at timestamptz default now()

Row Level Security (example intent):
- enable RLS on notes
- policy: owners can select/update/delete their rows
- policy: all authenticated users can select rows for browsing (or restrict as needed)
- optionally restrict select to a curated set depending on your app’s needs

### Services/API Layer

src/lib/notesService.js provides:
- fetchNotes, fetchNoteById: read notes (RLS-compliant)
- createNote, updateNote, deleteNote: CUD operations for owners
- getSignedUrl: secure temporary access to a file in Storage
- listCategories: derive distinct categories
- trackView, trackDownload: best-effort inserts into note_events if table exists

### Authentication

src/hooks/useAuth.js exposes:
- user, session, loading, error
- signInWithPassword, signUpWithPassword
- signInWithGoogle (OAuth with redirect)
- signOut

UI components wired:
- AuthModal handles login/signup + “Continue with Google”
- Navbar shows login/signup or user info + logout
- Upload flow requires authentication

### Upload Flow

- UploadModal validates the chosen PDF (type and size), optionally extracts PDF page count client-side via pdfjs, uploads to Supabase Storage (notes bucket), then inserts a row into notes via notesService.createNote.
- NoteDetailPage generates a short-lived signed URL for preview and download, and records best-effort analytics.

### Tags, Avatars, Analytics, and PDF Page Count

- Tags: stored as text[]; UI supports comma-separated entry and chips in cards.
- Avatars: Avatar component uses Gravatar for emails with an initials fallback.
- Analytics: trackView/trackDownload are best-effort; safe to enable without breaking if table missing.
- PDF Page Count: client-side extraction using pdfjs (lazy-loaded CDN script in UploadModal).

## Architecture Overview

- React 18 + React Router v6
- Contexts:
  - AuthProvider: authentication/session
  - UIProvider: modal + toast state
  - SearchFilterProvider: search/category/tags filter state shared with Navbar and pages
- Theming: theme.js injects CSS variables for light/dark and Ocean Professional tokens
- Pages:
  - HomePage: hero, filters, grid, pagination
  - BrowsePage: basic browse
  - UploadPage: auth-gated upload experience with modal
  - ProfilePage: account info and placeholder list
  - NoteDetailPage: secure preview + download and owner actions
- Components: common UI primitives with accessible states and consistent styling

## Developer Onboarding

- Prereqs: Node 18+, npm
- Install: cd react_frontend && npm install
- Configure Supabase:
  - Set REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY, REACT_APP_SITE_URL
  - Create notes bucket and set Storage policies
  - Create notes table (schema above) and enable RLS + policies
  - Optional: create note_events table for analytics
- Start dev server: npm start
- Run tests: npm test

## Deployment Notes

- Ensure REACT_APP_* env vars are provided at build time
- Configure Site URL and Redirect URLs in Supabase for production domain
- Consider stricter RLS for production (e.g., only owners read or moderated public browse)

## References

- Supabase client: react_frontend/src/lib/supabaseClient.js
- Services: react_frontend/src/lib/notesService.js
- Auth: react_frontend/src/hooks/useAuth.js
- UI/Routes: react_frontend/src/
