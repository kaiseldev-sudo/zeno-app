"use client";

import { useState, useCallback } from 'react';
import { checkRateLimit, createRateLimitError, RateLimitConfig } from '@/lib/security';

interface RateLimitState {
  isBlocked: boolean;
  remaining: number;
  resetTime: number;
  error: string | null;
}

/**
 * Hook to manage rate limiting for various operations
 */
export function useRateLimit(identifier: string, config: RateLimitConfig) {
  const [state, setState] = useState<RateLimitState>({
    isBlocked: false,
    remaining: config.maxAttempts,
    resetTime: 0,
    error: null
  });

  const checkLimit = useCallback((): boolean => {
    const result = checkRateLimit(identifier, config);
    
    setState({
      isBlocked: !result.allowed,
      remaining: result.remaining,
      resetTime: result.resetTime,
      error: result.allowed ? null : createRateLimitError(result.resetTime).message
    });

    return result.allowed;
  }, [identifier, config]);

  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const getRemainingTime = useCallback((): number => {
    if (!state.isBlocked) return 0;
    return Math.max(0, Math.ceil((state.resetTime - Date.now()) / 1000));
  }, [state.isBlocked, state.resetTime]);

  return {
    isBlocked: state.isBlocked,
    remaining: state.remaining,
    error: state.error,
    checkLimit,
    resetError,
    getRemainingTime
  };
}
