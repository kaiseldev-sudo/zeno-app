/**
 * Input sanitization utilities to prevent XSS and other injection attacks
 */

/**
 * Sanitizes a string by removing/encoding potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // HTML encode dangerous characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove data: protocol for potential data URIs
    .replace(/data:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Sanitizes an email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email
    .toLowerCase()
    .trim()
    // Remove any characters that aren't valid in email addresses
    .replace(/[^a-z0-9@._-]/g, '')
    // Ensure only one @ symbol
    .replace(/(@.*?)@/g, '$1')
    // Remove multiple consecutive dots
    .replace(/\.{2,}/g, '.')
    // Remove leading/trailing dots
    .replace(/^\.+|\.+$/g, '');
}

/**
 * Sanitizes a name field (allows letters, spaces, hyphens, apostrophes)
 */
export function sanitizeName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }

  let sanitized = name
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: and other protocols
    .replace(/(javascript|data|vbscript):/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove function calls and parentheses (critical for XSS prevention)
    .replace(/\w+\s*\([^)]*\)/g, '')
    // Remove double quotes and backticks completely
    .replace(/["`]/g, '')
    // Remove other dangerous characters
    .replace(/[(){}[\];=<>]/g, '');

  // Handle single quotes more carefully - only allow if surrounded by letters (for names like O'Connor)
  sanitized = sanitized.replace(/'/g, (match, offset, string) => {
    const before = string[offset - 1];
    const after = string[offset + 1];
    // Allow apostrophe only if it's between letters (for contractions/names)
    if (before && after && /[a-zA-Z]/.test(before) && /[a-zA-Z]/.test(after)) {
      return "'";
    }
    return ''; // Remove standalone or suspicious quotes
  });

  return sanitized
    // Allow only letters, spaces, hyphens, periods, apostrophes, and common international characters
    .replace(/[^a-zA-Z\s\-'\.àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ]/g, '')
    // Remove multiple consecutive spaces
    .replace(/\s{2,}/g, ' ')
    // Trim whitespace
    .trim()
    // Limit length
    .substring(0, 100);
}

/**
 * Sanitizes a subject line
 */
export function sanitizeSubject(subject: string): string {
  if (!subject || typeof subject !== 'string') {
    return '';
  }

  return subject
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove script content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove potentially dangerous characters but allow more flexibility than names
    .replace(/[<>'"&]/g, '')
    // Remove javascript: and other protocols
    .replace(/(javascript|data|vbscript):/gi, '')
    // Remove multiple consecutive spaces
    .replace(/\s{2,}/g, ' ')
    // Trim whitespace
    .trim()
    // Limit length
    .substring(0, 200);
}

/**
 * Sanitizes textarea content (descriptions, steps, etc.)
 */
export function sanitizeTextarea(content: string): string {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return content
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove dangerous HTML tags
    .replace(/<(iframe|object|embed|link|meta|form|input|button)[^>]*>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove data: protocol
    .replace(/data:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // HTML encode remaining dangerous characters
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Remove multiple consecutive newlines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Trim whitespace
    .trim()
    // Limit length
    .substring(0, 5000);
}

/**
 * Sanitizes a select option value
 */
export function sanitizeSelectValue(value: string, allowedValues: string[]): string {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const sanitized = value.trim().toLowerCase();
  
  // Only allow predefined values
  if (allowedValues.includes(sanitized)) {
    return sanitized;
  }
  
  return '';
}

/**
 * Comprehensive form data sanitization
 */
export interface SanitizedFormData {
  type: string;
  subject: string;
  email: string;
  name: string;
  description: string;
  steps: string;
  expectedBehavior: string;
  actualBehavior: string;
  browser: string;
  device: string;
  urgency: string;
}

export function sanitizeFormData(formData: any): SanitizedFormData {
  const allowedTypes = ['bug', 'feature', 'ui', 'performance', 'other'];
  const allowedUrgency = ['low', 'medium', 'high', 'critical'];
  const allowedBrowsers = ['', 'chrome', 'firefox', 'safari', 'edge', 'opera', 'other'];
  const allowedDevices = ['', 'desktop', 'laptop', 'tablet', 'mobile'];

  return {
    type: sanitizeSelectValue(formData.type || '', allowedTypes),
    subject: sanitizeSubject(formData.subject || ''),
    email: sanitizeEmail(formData.email || ''),
    name: sanitizeName(formData.name || ''),
    description: sanitizeTextarea(formData.description || ''),
    steps: sanitizeTextarea(formData.steps || ''),
    expectedBehavior: sanitizeTextarea(formData.expectedBehavior || ''),
    actualBehavior: sanitizeTextarea(formData.actualBehavior || ''),
    browser: sanitizeSelectValue(formData.browser || '', allowedBrowsers),
    device: sanitizeSelectValue(formData.device || '', allowedDevices),
    urgency: sanitizeSelectValue(formData.urgency || 'medium', allowedUrgency),
  };
}

/**
 * Validates that required fields are present after sanitization
 */
export function validateSanitizedData(data: SanitizedFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.type) {
    errors.push('Problem type is required');
  }

  if (!data.subject || data.subject.length < 3) {
    errors.push('Subject must be at least 3 characters');
  }

  if (!data.email) {
    errors.push('Email address is required');
  }

  if (!data.description || data.description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
