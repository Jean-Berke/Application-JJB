import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { BeltLevel } from '../theme/tokens';

export type RemoteProfile = {
  id: string;
  handle: string;
  display_name: string;
  bio: string;
  belt: BeltLevel;
  stripes: number;
  belt_verified: boolean;
  is_coach: boolean;
  onboarding_completed: boolean;
};

type AuthState = {
  loading: boolean;
  session: Session | null;
  profile: RemoteProfile | null;
  signUp: (email: string, password: string, handle: string, displayName: string) => Promise<{ error: string | null; needsEmailConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<RemoteProfile, 'belt' | 'stripes' | 'onboarding_completed'>>) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<RemoteProfile | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile((data as RemoteProfile) ?? null);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchProfile(data.session.user.id);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) fetchProfile(newSession.user.id);
      else setProfile(null);
    });

    return () => subscription.subscription.unsubscribe();
  }, [fetchProfile]);

  const value: AuthState = {
    loading,
    session,
    profile,
    signUp: async (email, password, handle, displayName) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { handle, display_name: displayName } },
      });
      return { error: error?.message ?? null, needsEmailConfirmation: !data.session };
    },
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
    refreshProfile: async () => {
      if (session) await fetchProfile(session.user.id);
    },
    updateProfile: async (updates) => {
      if (!session) return;
      await supabase.from('profiles').update(updates).eq('id', session.user.id);
      await fetchProfile(session.user.id);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
