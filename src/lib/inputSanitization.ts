import DOMPurify from 'isomorphic-dompurify';

// DOMPurify instance - isomorphic-dompurify handles both client and server environments

/**
 * Sanitizes user input to prevent XSS attacks
 * @param input - The user input to sanitize
 * @param options - Sanitization options
 * @returns Sanitized string
 */
export function sanitizeInput(
  input: string,
  options: {
    allowHTML?: boolean;
    maxLength?: number;
    trim?: boolean;
  } = {}
): string {
  const {
    allowHTML = false,
    maxLength = 1000,
    trim = true
  } = options;

  if (!input || typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Trim whitespace if requested
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // Sanitize HTML
  if (allowHTML) {
    // Allow only safe HTML tags and attributes
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'br'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  } else {
    // Strip all HTML and encode special characters
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });
  }

  return sanitized;
}

/**
 * Sanitizes email input specifically
 * @param email - The email to sanitize
 * @returns Sanitized email
 */
export function sanitizeEmail(email: string): string {
  return sanitizeInput(email, {
    allowHTML: false,
    maxLength: 254, // RFC 5321 email length limit
    trim: true
  });
}

/**
 * Sanitizes name input specifically
 * @param name - The name to sanitize
 * @returns Sanitized name
 */
export function sanitizeName(name: string): string {
  return sanitizeInput(name, {
    allowHTML: false,
    maxLength: 100,
    trim: true
  });
}

/**
 * Sanitizes password input (minimal sanitization to preserve special characters)
 * @param password - The password to sanitize
 * @returns Sanitized password
 */
export function sanitizePassword(password: string): string {
  if (!password || typeof password !== 'string') {
    return '';
  }
  
  // For passwords, we only trim and limit length
  // We don't strip HTML as it could interfere with special characters
  let sanitized = password.trim();
  
  if (sanitized.length > 128) {
    sanitized = sanitized.substring(0, 128);
  }
  
  return sanitized;
}

/**
 * Sanitizes course/subject input
 * @param course - The course to sanitize
 * @returns Sanitized course
 */
export function sanitizeCourse(course: string): string {
  return sanitizeInput(course, {
    allowHTML: false,
    maxLength: 100,
    trim: true
  });
}

/**
 * Sanitizes year level input
 * @param yearLevel - The year level to sanitize
 * @returns Sanitized year level
 */
export function sanitizeYearLevel(yearLevel: string): string {
  return sanitizeInput(yearLevel, {
    allowHTML: false,
    maxLength: 50,
    trim: true
  });
}
