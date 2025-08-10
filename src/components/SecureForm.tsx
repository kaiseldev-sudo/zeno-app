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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    // Check if CSRF token is ready
    if (!csrfReady || !csrfToken) {
      setSubmitError('Security token not ready. Please refresh the page and try again.');
      return;
    }

    // Check rate limit
    if (!checkLimit()) {
      return; // Rate limit error will be shown by the hook
    }

    if (disabled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await onSubmit(formData, csrfToken);
      
      // Refresh CSRF token after successful submission
      refreshToken();
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || 'An error occurred while submitting the form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = rateLimitError || submitError;

  return (
    <div className="w-full">
      {/* Security Status Indicators (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-gray-100 rounded-md text-sm text-gray-600">
          <div>🔒 CSRF Token: {csrfReady ? '✅ Ready' : '⏳ Loading'}</div>
          <div>🛡️ Rate Limit: {isBlocked ? '🚫 Blocked' : '✅ Available'}</div>
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
        <div className={`${isSubmitting || isBlocked || !csrfReady ? 'opacity-50 pointer-events-none' : ''}`}>
          {children}
        </div>
      </form>
    </div>
  );
}
