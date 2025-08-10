/**
 * Email uniqueness validation utilities
 */

import { supabase } from './supabase';

export interface EmailUniquenessResult {
  isAvailable: boolean;
  error?: string;
}

/**
 * Check if an email address is already registered in the system
 */
export async function checkEmailUniqueness(email: string): Promise<EmailUniquenessResult> {
  if (!email || !email.trim()) {
    return {
      isAvailable: false,
      error: 'Email address is required'
    };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check in auth.users first (Supabase auth table)
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      // If we can't access auth.users (likely due to permissions), check profiles table
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', normalizedEmail)
        .limit(1);

      if (profileError) {
        console.error('Error checking email uniqueness:', profileError);
        return {
          isAvailable: false,
          error: 'Unable to verify email availability. Please try again.'
        };
      }

      return {
        isAvailable: profiles.length === 0
      };
    }

    // Check if email exists in auth users
    const emailExists = authUsers.users.some(user => 
      user.email?.toLowerCase() === normalizedEmail
    );

    return {
      isAvailable: !emailExists
    };

  } catch (error) {
    console.error('Error checking email uniqueness:', error);
    return {
      isAvailable: false,
      error: 'Unable to verify email availability. Please try again.'
    };
  }
}

/**
 * Validate email uniqueness with user-friendly error messages
 */
export async function validateEmailUniqueness(email: string): Promise<{
  isValid: boolean;
  message?: string;
  error?: string;
}> {
  const result = await checkEmailUniqueness(email);
  
  if (result.error) {
    return {
      isValid: false,
      error: result.error
    };
  }

  if (!result.isAvailable) {
    return {
      isValid: false,
      message: 'This email address is already registered. Please use a different email or try signing in instead.'
    };
  }

  return {
    isValid: true,
    message: 'Email address is available'
  };
}

/**
 * Check email uniqueness for client-side validation (without admin access)
 * This uses a more limited approach but works with RLS policies
 */
export async function checkEmailUniquenessClient(email: string): Promise<EmailUniquenessResult> {
  if (!email || !email.trim()) {
    return {
      isAvailable: false,
      error: 'Email address is required'
    };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check profiles table (this is accessible with RLS)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', normalizedEmail)
      .limit(1);

    if (profileError) {
      console.error('Error checking email uniqueness:', profileError);
      return {
        isAvailable: false,
        error: 'Unable to verify email availability. Please try again.'
      };
    }

    return {
      isAvailable: profiles.length === 0
    };

  } catch (error) {
    console.error('Error checking email uniqueness:', error);
    return {
      isAvailable: false,
      error: 'Unable to verify email availability. Please try again.'
    };
  }
}
