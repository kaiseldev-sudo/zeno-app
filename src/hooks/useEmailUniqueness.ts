import { useState, useEffect, useCallback } from 'react';
import { checkEmailUniquenessClient, EmailUniquenessResult } from '@/lib/emailUniqueness';

interface UseEmailUniquenessOptions {
  debounceMs?: number;
  enabled?: boolean;
}

interface UseEmailUniquenessReturn {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
  checkEmail: (email: string) => Promise<void>;
  clearCheck: () => void;
}

/**
 * Custom hook for real-time email uniqueness validation
 */
export function useEmailUniqueness(
  options: UseEmailUniquenessOptions = {}
): UseEmailUniquenessReturn {
  const { debounceMs = 1000, enabled = true } = options;

  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastCheckedEmail, setLastCheckedEmail] = useState<string>('');

  /**
   * Clear any existing debounce timer
   */
  const clearDebounceTimer = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      setDebounceTimer(null);
    }
  }, [debounceTimer]);

  /**
   * Check email uniqueness
   */
  const checkEmail = useCallback(async (email: string) => {
    if (!enabled) return;

    // Don't check empty emails or if it's the same email we just checked
    if (!email.trim() || email === lastCheckedEmail) {
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsAvailable(null);
      setError(null);
      return;
    }

    // Clear any existing timer
    clearDebounceTimer();

    // Set up debounced validation
    const timer = setTimeout(async () => {
      setIsChecking(true);
      setError(null);
      
      try {
        const result: EmailUniquenessResult = await checkEmailUniquenessClient(email);
        setIsAvailable(result.isAvailable);
        setLastCheckedEmail(email);
        
        if (result.error) {
          setError(result.error);
        }
      } catch (error) {
        console.error('Email uniqueness check error:', error);
        setError('Unable to verify email availability. Please try again.');
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    }, debounceMs);

    setDebounceTimer(timer);
  }, [debounceMs, enabled, lastCheckedEmail, clearDebounceTimer]);

  /**
   * Clear validation state
   */
  const clearCheck = useCallback(() => {
    clearDebounceTimer();
    setIsChecking(false);
    setIsAvailable(null);
    setError(null);
    setLastCheckedEmail('');
  }, [clearDebounceTimer]);

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, [clearDebounceTimer]);

  return {
    isChecking,
    isAvailable,
    error,
    checkEmail,
    clearCheck,
  };
}
