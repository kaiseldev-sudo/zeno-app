"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, safeGetSession, safeSignOut } from "./supabase";
import { checkRateLimit, RATE_LIMITS, createRateLimitError } from "./security";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { session, error } = await safeGetSession();
        if (error) {
          console.error("Error getting session:", error);
          // If there's an error getting session, treat as no session
          setSession(null);
          setUser(null);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error("Failed to get initial session:", error);
        // If there's an exception, treat as no session
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          // Handle different auth events
          if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
            setSession(session);
            setUser(session?.user ?? null);
          }
          setLoading(false);
        } catch (error) {
          console.error("Auth state change error:", error);
          // On error, clear the session
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Check rate limit for signup attempts
      const rateLimitResult = checkRateLimit(email, RATE_LIMITS.SIGNUP);
      if (!rateLimitResult.allowed) {
        const rateLimitError = createRateLimitError(rateLimitResult.resetTime);
        return { data: null, error: rateLimitError };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            course: userData.course,
            year_level: userData.yearLevel,
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Check rate limit for login attempts
      const rateLimitResult = checkRateLimit(email, RATE_LIMITS.LOGIN);
      if (!rateLimitResult.allowed) {
        const rateLimitError = createRateLimitError(rateLimitResult.resetTime);
        return { data: null, error: rateLimitError };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await safeSignOut();
      if (error) {
        console.error('Sign out error:', error);
      }
      // Always clear the local state regardless of success/failure
      setSession(null);
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      // Even if signOut fails, clear the local state
      setSession(null);
      setUser(null);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}