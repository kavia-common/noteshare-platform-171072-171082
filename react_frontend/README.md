# React Frontend (NoteShare)

## Introduction

This frontend is a modern React application that lets users authenticate, upload categorized PDF notes, browse and filter content, preview PDFs via signed URLs, and download them securely. It uses Supabase for Authentication, Database, and Storage, and follows the Ocean Professional theme.

## Features

- Tag chips and multi-select filter with keyboard support
- Google OAuth via Supabase; email/password with email redirects
- Avatars using Gravatar with initials fallback
- Client-side PDF page count extraction using pdfjs (lazy-loaded)
- Optional analytics: view/download counters using a note_events table
- Responsive, accessible UI with a light/dark theme toggle

## Getting Started

1) Install dependencies
   - npm install

2) Configure environment variables
   - Copy .env.sample to .env
   - Fill in:
     - REACT_APP_SUPABASE_URL
     - REACT_APP_SUPABASE_ANON_KEY
     - REACT_APP_SITE_URL (recommended; used for auth email + OAuth redirects)

3) Run the app
   - npm start
   - Open http://localhost:3000

4) Tests
   - npm test

5) Build
   - npm run build

## Environment Variables

Create react_frontend/.env from .env.sample:

- REACT_APP_SUPABASE_URL: Supabase project URL (https://<project-ref>.supabase.co)
- REACT_APP_SUPABASE_ANON_KEY: Supabase anon (public) key
- REACT_APP_SITE_URL: Site URL used for email confirmations and OAuth redirects (http://localhost:3000 in dev; your domain in prod)

These are used by:
- src/lib/supabaseClient.js (client initialization)
- src/hooks/useAuth.js (auth redirects/sign up email redirects)

Never commit .env files.

## Supabase Integration

We use Supabase for:
- Authentication: Email/Password and Google OAuth
- Database: notes table (plus a best-effort note_events table for analytics)
- Storage: notes bucket for uploaded PDFs

Supabase client initialization:
- File: src/lib/supabaseClient.js
- Singleton pattern to avoid multiple instances across hot reloads
- Reads REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY

### Google OAuth Setup

1) Supabase Dashboard configuration
   - Authentication → URL Configuration
     - Site URL: set to REACT_APP_SITE_URL
     - Add dev/prod URLs to Additional Redirect URLs
   - Authentication → Providers → Google
     - Enable Google
     - Enter Client ID and Client Secret (from Google Cloud)

2) Frontend flow
   - useAuth.signInWithGoogle() initiates OAuth
   - Redirect URL uses REACT_APP_SITE_URL or window.location.origin

### Storage Bucket and Policies

- Create a Storage bucket named notes
- Upload files under path: {user_id}/{unique_filename}.pdf (UploadModal enforces this)
- Preview and download use short-lived signed URLs

Recommended Storage policies (adapt to your needs):
- Allow authenticated users to upload files within their folder path = auth.uid()/*
- Allow reads via signed URLs (or public read if your app requires it)
- Ensure policies align with your RLS model

### Database Schema and RLS

Minimum schema for notes:

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

Optional analytics table note_events:
- id uuid pk default gen_random_uuid()
- note_id uuid references notes(id)
- type text check (type in ('view','download'))
- created_at timestamptz default now()

Row Level Security (RLS) guidance:
- Enable RLS on notes
- Owners can select/update/delete their own rows
- Allow browse reads for all authenticated users (or restrict as needed)
- Storage policies should be consistent with RLS and your sharing model

## Services and API Usage

Location: src/lib/notesService.js

- fetchNotes({ limit, offset, search, category, tags }): list notes with filters; respects RLS
- fetchNoteById(id): fetch one note
- createNote(payload): insert a new note; uses current auth user_id
- updateNote(id, changes): update a note; RLS should restrict to owner
- deleteNote(id): delete a note; RLS should restrict to owner
- getSignedUrl({ bucket, path, expiresIn }): generate a short-lived signed URL for Storage
- listCategories(): derive distinct categories from notes
- trackView(noteId) / trackDownload(noteId): best-effort analytics inserts into note_events if present

Supabase client: src/lib/supabaseClient.js

## Authentication

Location: src/hooks/useAuth.js

Exposes:
- user, session, loading, error
- signInWithPassword(email, password)
- signUpWithPassword(email, password) (uses REACT_APP_SITE_URL for emailRedirectTo)
- signInWithGoogle()
- signOut()

UI integration:
- AuthModal supports login/signup + “Continue with Google”
- Navbar reflects session state (Login/Sign Up vs. avatar + email + Logout)
- Upload flow requires authentication (UploadModal opens only for signed-in users)

## Upload Flow and PDF Handling

UploadModal:
- Validates PDF type and size (25MB limit)
- Lazily loads pdfjs from CDN to extract page count without bundler issues
- Uploads to Supabase Storage (notes bucket) under {user_id}/{unique_filename}.pdf
- Creates a row in notes via notesService.createNote

NoteDetailPage:
- Generates a signed URL for secure preview and download
- Records best-effort analytics (view/download)
- Shows owner actions (Edit/Delete) when applicable

## Tags, Avatars, Analytics, PDF Page Count

- Tags: stored as text[]; FiltersBar adds chips; NoteCard displays up to three with a “+N” overflow
- Avatars: Avatar uses Gravatar via email; falls back to initials; minimal inline MD5 to avoid extra dependency
- Analytics: trackView/trackDownload are optional and no-op if table or policy is missing
- PDF Page Count: extracted client-side; non-blocking if extraction fails

## Architecture Overview

- React 18 + React Router v6
- Contexts:
  - AuthProvider: auth/session
  - UIProvider: modals (AuthModal, UploadModal) and toasts
  - SearchFilterProvider: global search/category/tags filters
- Theming:
  - src/theme.js applies CSS variables for light/dark and Ocean Professional tokens
- Routing:
  - src/routes.jsx defines root App shell (Navbar + global modals + Outlet) and nested routes:
    - HomePage (/)
    - BrowsePage (/browse)
    - UploadPage (/upload)
    - ProfilePage (/profile)
    - NoteDetailPage (/notes/:id)
    - NotFoundPage (*)
- Components:
  - Common UI (Button, Input, Select, Badge, EmptyState, ErrorState, LoadingSkeleton, Avatar)
  - Layout (Navbar, Container)
  - Upload (FloatingActionButton, UploadModal)
  - Auth (AuthModal)

## Developer Onboarding

- Prerequisites: Node 18+, npm
- Setup:
  - npm install
  - Copy .env.sample to .env and set REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY, REACT_APP_SITE_URL
- Supabase:
  - Create notes Storage bucket and Storage policies
  - Create notes table and enable RLS + policies
  - (Optional) create note_events table for analytics
  - Enable Google OAuth and configure Site URL/Redirects
- Run:
  - npm start for local development
  - npm test for tests
- Deployment:
  - Provide REACT_APP_* at build time
  - Set Site URL and Redirect URLs in Supabase to your production domain
  - Harden RLS and Storage policies for production

## References

- Supabase client: src/lib/supabaseClient.js
- Services: src/lib/notesService.js
- Auth: src/hooks/useAuth.js
- Routes: src/routes.jsx
- Theme: src/theme.js
