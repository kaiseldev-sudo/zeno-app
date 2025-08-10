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
    if (session?.user?.id) {
      const token = generateCSRFToken(session.user.id);
      setCSRFToken(token);
    } else {
      setCSRFToken('');
    }
  }, [session?.user?.id]);

  // Validate CSRF token
  const validateToken = useCallback((token: string): boolean => {
    if (!session?.user?.id) {
      return false;
    }
    return validateCSRFToken(session.user.id, token);
  }, [session?.user?.id]);

  // Refresh CSRF token
  const refreshToken = useCallback(() => {
    if (session?.user?.id) {
      const token = generateCSRFToken(session.user.id);
      setCSRFToken(token);
    }
  }, [session?.user?.id]);

  return {
    csrfToken,
    validateToken,
    refreshToken,
    isReady: !!csrfToken && !!user
  };
}
