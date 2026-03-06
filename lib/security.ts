/**
 * Security utilities for OWASP Top 10 protection
 * A03:2021-Injection - Input sanitization and validation
 * A07:2021-Identification and Authentication Failures - Secure session handling
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML input to prevent XSS attacks
 * @param input - The input string to sanitize
 * @returns Sanitized string safe for HTML rendering
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return '';

  // Use DOMPurify to sanitize HTML
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed by default
    ALLOWED_ATTR: [], // No attributes allowed
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitizes URL parameters to prevent injection attacks
 * @param input - The URL parameter to sanitize
 * @returns Sanitized URL parameter
 */
export function sanitizeUrlParam(input: string): string {
  if (typeof input !== 'string') return '';

  // Remove potentially dangerous characters
  return input
    .replace(/[<>'"&]/g, '') // Remove HTML characters
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .trim();
}

/**
 * Validates and sanitizes email addresses
 * @param email - The email to validate and sanitize
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') return '';

  const sanitized = email.trim().toLowerCase();

  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(sanitized)) return '';

  return sanitized;
}

/**
 * Sanitizes search queries to prevent injection
 * @param query - The search query to sanitize
 * @returns Sanitized search query
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== 'string') return '';

  return query
    .trim()
    .replace(/[<>'"&|]/g, '') // Remove dangerous characters
    .replace(/\s+/g, ' ') // Normalize whitespace
    .substring(0, 200); // Limit length
}

/**
 * Generates a secure nonce for inline scripts/styles
 * @returns Random nonce string
 */
export function generateNonce(): string {
  return crypto.getRandomValues(new Uint8Array(16))
    .reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
}

/**
 * Validates file uploads for security
 * @param file - The file to validate
 * @param allowedTypes - Array of allowed MIME types
 * @param maxSize - Maximum file size in bytes
 * @returns Validation result
 */
export function validateFileUpload(
  file: File,
  allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp'],
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not allowed' };
  }

  // Check file extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const typeMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
  };

  const allowedExtensions = typeMap[file.type] || [];
  if (!extension || !allowedExtensions.includes(extension)) {
    return { valid: false, error: 'File extension does not match type' };
  }

  return { valid: true };
}

/**
 * Rate limiting helper for API calls
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }

    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);

    return true;
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

// Global rate limiter instance
export const apiRateLimiter = new RateLimiter(100, 60000); // 100 requests per minute