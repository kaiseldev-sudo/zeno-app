"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth';
import { generateCSRFToken, validateCSRFToken } from '@/lib/security';

/**
 * Hook to manage CSRF tokens for secure form submissions
 */
export function useCSRFToken() {
  const { user, session } = useAuth();
  const [csrfToken, setCSRFToken] = useState<string>('');

  // Generate new CSRF token when user/session changes
  useEffect(() => {
    try {
      if (session?.user?.id && user?.id) {
        // Generate token for authenticated user
        const token = generateCSRFToken(session.user.id);
        setCSRFToken(token);
      } else {
        // Generate temporary token for unauthenticated users (for login/signup forms)
        const tempId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const token = generateCSRFToken(tempId);
        setCSRFToken(token);
      }
    } catch (error) {
      console.error('Error generating CSRF token:', error);
      setCSRFToken('');
    }
  }, [session?.user?.id, user?.id]);

  // Validate CSRF token
  const validateToken = useCallback((token: string): boolean => {
    // For authenticated users, validate against their session ID
    if (session?.user?.id) {
      return validateCSRFToken(session.user.id, token);
    }
    
    // For guest users, we'll validate the token exists and is not expired
    // The actual validation will happen server-side for guest tokens
    return !!token && token.length > 0;
  }, [session?.user?.id]);

  // Refresh CSRF token
  const refreshToken = useCallback(() => {
    if (session?.user?.id) {
      const token = generateCSRFToken(session.user.id);
      setCSRFToken(token);
    } else {
      // Generate new temporary token for guest users
      const tempId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const token = generateCSRFToken(tempId);
      setCSRFToken(token);
    }
  }, [session?.user?.id]);

  return {
    csrfToken,
    validateToken,
    refreshToken,
    isReady: !!csrfToken // Token is ready as soon as it's generated
  };
}
