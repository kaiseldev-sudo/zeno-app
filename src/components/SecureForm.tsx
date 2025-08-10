"use client";

import React, { useState, useEffect } from 'react';
import { useCSRFToken } from '@/hooks/useCSRFToken';
import { useRateLimit } from '@/hooks/useRateLimit';
import { RateLimitConfig } from '@/lib/security';
import { AlertTriangle, Clock } from 'lucide-react';

interface SecureFormProps {
  onSubmit: (formData: FormData, csrfToken: string) => Promise<void>;
  rateLimitConfig: RateLimitConfig;
  rateLimitIdentifier: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

/**
 * Secure form wrapper that handles CSRF protection and rate limiting
 */
export default function SecureForm({
  onSubmit,
  rateLimitConfig,
  rateLimitIdentifier,
  children,
  className = '',
  disabled = false
}: SecureFormProps) {
  const { csrfToken, isReady: csrfReady, refreshToken } = useCSRFToken();
  const { isBlocked, error: rateLimitError, checkLimit, resetError, getRemainingTime } = useRateLimit(
    rateLimitIdentifier,
    rateLimitConfig
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState(0);

  // Update remaining time when rate limited
  useEffect(() => {
    if (isBlocked) {
      const updateTime = () => {
        const remaining = getRemainingTime();
        setRemainingTime(remaining);
        
        if (remaining <= 0) {
          resetError();
          setRemainingTime(0);
        }
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [isBlocked, getRemainingTime, resetError]);

  // Auto-dismiss submit errors after 1 second
  useEffect(() => {
    if (submitError && !isBlocked) {
      const timer = setTimeout(() => {
        setSubmitError('');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [submitError, isBlocked]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    // Check rate limit first
    if (!checkLimit()) {
      return; // Rate limit error will be shown by the hook
    }

    if (disabled || isSubmitting) {
      return;
    }

    // If CSRF token is not ready, wait a moment and try again
    if (!csrfReady || !csrfToken) {
      setSubmitError('Preparing security token, please wait a moment...');
      
      // Wait up to 3 seconds for token to be ready
      let attempts = 0;
      const maxAttempts = 30; // 3 seconds (100ms * 30)
      
      const waitForToken = async (): Promise<boolean> => {
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
          
          if (csrfToken && csrfReady) {
            setSubmitError('');
            return true;
          }
        }
        return false;
      };
      
      const tokenReady = await waitForToken();
      if (!tokenReady) {
        setSubmitError('Security token could not be generated. Please refresh the page and try again.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData, csrfToken);
      
      // Refresh CSRF token after successful submission
      refreshToken();
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Handle specific authentication errors
      if (error.message?.includes('session missing') || error.message?.includes('AuthSessionMissingError')) {
        setSubmitError('Your session has expired. Please refresh the page and sign in again.');
      } else if (error.message?.includes('Rate limit exceeded')) {
        // Rate limit errors are handled by the rate limit hook
        return;
      } else {
        setSubmitError(error.message || 'An error occurred while submitting the form.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = rateLimitError || submitError;

  return (
    <div className="w-full">


      {/* CSRF Token Loading Indicator (production-friendly) */}
      {!csrfReady && !isBlocked && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <p className="text-blue-800 text-sm">Initializing security features...</p>
          </div>
        </div>
      )}

      {/* Rate Limit Warning */}
      {isBlocked && remainingTime > 0 && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-md">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-orange-500 mr-2" />
            <div>
              <p className="text-orange-800 font-medium">Rate limit exceeded</p>
              <p className="text-orange-700 text-sm">
                Please wait {remainingTime} seconds before trying again.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {showError && !isBlocked && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-800">{showError}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className={className}>
        {/* Hidden CSRF Token Field */}
        <input type="hidden" name="csrf_token" value={csrfToken} />
        
        {/* Form Content */}
        <div className={`${isSubmitting || isBlocked ? 'opacity-50 pointer-events-none' : ''}`}>
          {children}
        </div>
      </form>
    </div>
  );
}
