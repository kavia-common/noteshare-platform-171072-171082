import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import supabase from '../lib/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * AuthContext / useAuth
 * Application-wide authentication state and actions using Supabase.
 * Exposes:
 *  - user: Supabase user object or null
 *  - session: Supabase session or null
 *  - loading: boolean while initial session loads or actions are in-flight
 *  - error: last auth error string (if any)
 *  - signInWithPassword(email, password)
 *  - signUpWithPassword(email, password)
 *  - signOut()
 */
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  error: null,
  signInWithPassword: async () => {},
  signUpWithPassword: async () => {},
  signOut: async () => {},
});

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides Supabase session and auth actions to the app. */
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setLoading(true);
      const { data, error: err } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (err) {
        setError(err.message);
      }
      setSession(data?.session || null);
      setUser(data?.session?.user || null);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      setUser(sess?.user || null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  // PUBLIC_INTERFACE
  const signInWithPassword = async (email, password) => {
    /**
     * Sign in using email/password.
     * Returns { user, session } or throws on error.
     */
    setError(null);
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError(err.message);
      throw err;
    }
    setSession(data.session);
    setUser(data.user);
    return data;
  };

  // PUBLIC_INTERFACE
  const signUpWithPassword = async (email, password) => {
    /**
     * Sign up using email/password.
     * Will send a confirmation email if the project requires it.
     */
    setError(null);
    const emailRedirectTo = process.env.REACT_APP_SITE_URL || window.location.origin;
    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });
    if (err) {
      setError(err.message);
      throw err;
    }
    // After signUp, depending on Supabase settings, a confirmation email may be required.
    // We keep state in sync and let the UI notify the user.
    setSession(data.session || null);
    setUser(data.user || null);
    return data;
  };

  // PUBLIC_INTERFACE
  const signOut = async () => {
    /** Signs out the current user. */
    setError(null);
    const { error: err } = await supabase.auth.signOut();
    if (err) {
      setError(err.message);
      throw err;
    }
    setSession(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      error,
      signInWithPassword,
      signUpWithPassword,
      signOut,
    }),
    [user, session, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Access AuthContext values and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
