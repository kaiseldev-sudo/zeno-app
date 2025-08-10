/**
 * Security utilities for rate limiting and CSRF protection
 */

// Rate limiting storage using Map for simplicity (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  keyGenerator?: (identifier: string) => string;
}

/**
 * Rate limiting utility
 * @param identifier - Unique identifier (IP, user ID, email, etc.)
 * @param config - Rate limit configuration
 * @returns Object with allowed status and remaining attempts
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const key = config.keyGenerator ? config.keyGenerator(identifier) : identifier;
  const now = Date.now();
  
  // Clean up expired entries
  cleanupExpiredEntries();
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || existing.resetTime <= now) {
    // First attempt or window has reset
    const resetTime = now + config.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime
    };
  }
  
  if (existing.count >= config.maxAttempts) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: existing.resetTime
    };
  }
  
  // Increment count
  existing.count += 1;
  rateLimitStore.set(key, existing);
  
  return {
    allowed: true,
    remaining: config.maxAttempts - existing.count,
    resetTime: existing.resetTime
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Reset rate limit for a specific identifier
 * @param identifier - The identifier to reset
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

// CSRF Protection
const csrfTokens = new Map<string, { token: string; expiresAt: number }>();

/**
 * Generate a CSRF token for a user session
 * @param sessionId - User session identifier
 * @returns CSRF token
 */
export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + (1000 * 60 * 60); // 1 hour expiry
  
  csrfTokens.set(sessionId, { token, expiresAt });
  
  // Clean up expired tokens
  cleanupExpiredCSRFTokens();
  
  return token;
}

/**
 * Validate CSRF token
 * @param sessionId - User session identifier
 * @param token - Token to validate
 * @returns Whether the token is valid
 */
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  if (stored.expiresAt <= Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return stored.token === token;
}

/**
 * Clean up expired CSRF tokens
 */
function cleanupExpiredCSRFTokens(): void {
  const now = Date.now();
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (data.expiresAt <= now) {
      csrfTokens.delete(sessionId);
    }
  }
}

/**
 * Remove CSRF token for a session
 * @param sessionId - Session identifier
 */
export function removeCSRFToken(sessionId: string): void {
  csrfTokens.delete(sessionId);
}

// Rate limit configurations for different operations
export const RATE_LIMITS = {
  LOGIN: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    keyGenerator: (email: string) => `login:${email}`
  },
  SIGNUP: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyGenerator: (email: string) => `signup:${email}`
  },
  PASSWORD_RESET: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyGenerator: (email: string) => `password_reset:${email}`
  },
  GROUP_CREATION: {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyGenerator: (userId: string) => `group_creation:${userId}`
  },
  PROFILE_UPDATE: {
    maxAttempts: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyGenerator: (userId: string) => `profile_update:${userId}`
  }
} as const;

/**
 * Get user's IP address (for server-side usage)
 * @param request - Request object
 * @returns IP address
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Create a rate limit error response
 * @param resetTime - When the rate limit resets
 * @returns Error response object
 */
export function createRateLimitError(resetTime: number) {
  const resetInSeconds = Math.ceil((resetTime - Date.now()) / 1000);
  
  return {
    error: 'Rate limit exceeded',
    message: `Too many attempts. Please try again in ${resetInSeconds} seconds.`,
    resetTime,
    type: 'RATE_LIMIT_EXCEEDED'
  };
}

/**
 * Create a CSRF error response
 * @returns Error response object
 */
export function createCSRFError() {
  return {
    error: 'CSRF token validation failed',
    message: 'Invalid or missing CSRF token. Please refresh the page and try again.',
    type: 'CSRF_ERROR'
  };
}
