/**
 * Auth context — tracks the Supabase session and exposes sign in / sign out.
 * The book data is still local/mock; this only wires up the *user* side.
 */
import type { AuthError, Session, User } from '@supabase/supabase-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase } from '@/lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** Display name: user_metadata name → email handle → fallback. */
  displayName: string;
  /** True when the signed-in user has the admin role (app_metadata.role). */
  isAdmin: boolean;
  /** True until the persisted session has been loaded. */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

/** Resolves a friendly display name from a Supabase user. */
function resolveDisplayName(user: User | null): string {
  const meta = user?.user_metadata as { name?: string; full_name?: string } | undefined;
  const fromMeta = meta?.name ?? meta?.full_name;
  if (fromMeta) return fromMeta;
  if (user?.email) return user.email.split('@')[0];
  return 'Leitor(a)';
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      return { error };
    },
    [],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;
    const role = (user?.app_metadata as { role?: string } | undefined)?.role;
    return {
      session,
      user,
      displayName: resolveDisplayName(user),
      isAdmin: role === 'admin',
      loading,
      signIn,
      signOut,
    };
  }, [session, loading, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
