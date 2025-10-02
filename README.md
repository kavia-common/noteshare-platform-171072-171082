# noteshare-platform-171072-171082

## Supabase Setup (Frontend)

This project uses Supabase for authentication, storage, and database. To configure the React frontend:

1) Install dependencies (already configured to include @supabase/supabase-js):
   - From the react_frontend directory: `npm install`

2) Create a .env file based on the sample:
   - Copy react_frontend/.env.sample to react_frontend/.env
   - Populate:
     - REACT_APP_SUPABASE_URL
     - REACT_APP_SUPABASE_ANON_KEY
   - Do not commit the .env file.

3) Start the app:
   - `cd react_frontend && npm start`

The Supabase client is initialized in:
- react_frontend/src/lib/supabaseClient.js