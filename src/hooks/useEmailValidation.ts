import { useState, useEffect, useCallback } from 'react';
import { emailValidationService, EmailValidationResult } from '@/lib/emailValidation';

interface UseEmailValidationOptions {
  debounceMs?: number;
  validateOnMount?: boolean;
  autoCorrect?: boolean;
}

interface UseEmailValidationReturn {
  validationResult: EmailValidationResult | null;
  isValidating: boolean;
  validateEmail: (email: string) => Promise<void>;
  clearValidation: () => void;
  acceptSuggestion: () => void;
}

/**
 * Custom hook for email validation with debouncing and caching
 */
export function useEmailValidation(
  initialEmail?: string,
  options: UseEmailValidationOptions = {}
): UseEmailValidationReturn {
  const {
    debounceMs = 1000,
    validateOnMount = false,
    autoCorrect = true
  } = options;

  const [validationResult, setValidationResult] = useState<EmailValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastValidatedEmail, setLastValidatedEmail] = useState<string>('');

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
   * Validate email address
   */
  const validateEmail = useCallback(async (email: string) => {
    // Don't validate empty emails or if it's the same email we just validated
    if (!email.trim() || email === lastValidatedEmail) {
      return;
    }

    // Clear any existing timer
    clearDebounceTimer();

    // Set up debounced validation
    const timer = setTimeout(async () => {
      setIsValidating(true);
      try {
        const result = await emailValidationService.validateEmail(email, autoCorrect);
        setValidationResult(result);
        setLastValidatedEmail(email);
      } catch (error) {
        console.error('Email validation error:', error);
        setValidationResult({
          isValid: false,
          isDeliverable: false,
          qualityScore: 0,
          details: {
            validFormat: false,
            isFreeEmail: false,
            isDisposable: false,
            isRoleEmail: false,
            isCatchall: false,
            mxFound: false,
            smtpValid: false,
          },
          error: 'Validation failed'
        });
      } finally {
        setIsValidating(false);
      }
    }, debounceMs);

    setDebounceTimer(timer);
  }, [debounceMs, autoCorrect, lastValidatedEmail, clearDebounceTimer]);

  /**
   * Clear validation result
   */
  const clearValidation = useCallback(() => {
    clearDebounceTimer();
    setValidationResult(null);
    setIsValidating(false);
    setLastValidatedEmail('');
  }, [clearDebounceTimer]);

  /**
   * Accept email suggestion and return corrected email
   */
  const acceptSuggestion = useCallback(() => {
    if (validationResult?.suggestion) {
      // Clear current validation to trigger re-validation with suggestion
      setValidationResult(null);
      setLastValidatedEmail('');
      return validationResult.suggestion;
    }
    return null;
  }, [validationResult]);

  /**
   * Validate on mount if enabled and initial email is provided
   */
  useEffect(() => {
    if (validateOnMount && initialEmail) {
      validateEmail(initialEmail);
    }
  }, [validateOnMount, initialEmail, validateEmail]);

  /**
   * Cleanup timer on unmount
   */
  useEffect(() => {
    return () => {
      clearDebounceTimer();
    };
  }, [clearDebounceTimer]);

  return {
    validationResult,
    isValidating,
    validateEmail,
    clearValidation,
    acceptSuggestion,
  };
}
