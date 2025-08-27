"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, safeGetSession, safeSignOut, getBaseUrl } from "./supabase";
import { checkRateLimit, RATE_LIMITS, createRateLimitError } from "./security";
import { checkEmailUniquenessClient } from "./emailUniqueness";

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

      // Check email uniqueness before attempting signup
      const emailUniquenessResult = await checkEmailUniquenessClient(email);
      if (!emailUniquenessResult.isAvailable) {
        const error = emailUniquenessResult.error || 
          'This email address is already registered. Please use a different email or try signing in instead.';
        return { data: null, error: { message: error } };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${getBaseUrl()}/dashboard`
        }
      });

      if (error) {
        // Handle specific Supabase auth errors
        if (error.message?.includes('User already registered')) {
          const customError = { 
            message: 'This email address is already registered. Please use a different email or try signing in instead.' 
          };
          return { data: null, error: customError };
        }
        throw error;
      }

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
          
          // Handle unique constraint violation on email
          if (profileError.code === '23505' && profileError.message?.includes('email')) {
            const customError = { 
              message: 'This email address is already registered. Please use a different email or try signing in instead.' 
            };
            return { data: null, error: customError };
          }
        }
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('User already registered') || 
          error.message?.includes('email') && error.message?.includes('already')) {
        const customError = { 
          message: 'This email address is already registered. Please use a different email or try signing in instead.' 
        };
        return { data: null, error: customError };
      }
      
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

      // First, check if user exists in our profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      // Attempt sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide more specific error messages based on the error and user existence
        if (error.message.includes('Invalid login credentials')) {
          if (!profileData && profileError) {
            // User doesn't exist in our profiles table
            const userNotFoundError = new Error('User not found. Please check your email or sign up for an account.');
            return { data: null, error: userNotFoundError };
          } else {
            // User exists but password is wrong
            const wrongPasswordError = new Error('Invalid password. Please check your password and try again.');
            return { data: null, error: wrongPasswordError };
          }
        }
        throw error;
      }
      
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

// Function to check if email exists in auth.users table
export const checkEmailExists = async (email: string) => {
  try {
    console.log('checkEmailExists called with:', email);
    
    // Try to sign in with a dummy password to check if user exists
    // This is a common pattern to check user existence without revealing if password is correct
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'dummy-password-for-checking-existence'
    });

    console.log('Auth error in checkEmailExists:', error?.message);

    // If we get "Invalid login credentials", the user exists but password is wrong
    // If we get "User not found" or similar, the user doesn't exist
    if (error) {
      if (error.message?.includes('Invalid login credentials') || 
          error.message?.includes('Invalid login')) {
        // User exists but password is wrong
        console.log('User exists (invalid credentials)');
        return { exists: true, error: null };
      } else if (error.message?.includes('User not found') || 
                 error.message?.includes('not found') ||
                 error.message?.includes('Email not confirmed')) {
        // User doesn't exist
        console.log('User does not exist');
        return { exists: false, error: null };
      } else {
        // Some other error, treat as user doesn't exist for security
        console.log('Other error, treating as user does not exist:', error.message);
        return { exists: false, error: null };
      }
    }

    // This shouldn't happen with a dummy password, but just in case
    console.log('No error returned, user exists');
    return { exists: true, error: null };
  } catch (error) {
    console.error('Error checking email existence:', error);
    return { exists: false, error: 'Failed to verify email address' };
  }
};