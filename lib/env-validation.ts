/**
 * Environment variable validation for security
 * A05:2021-Security Misconfiguration - Secure configuration validation
 */

interface EnvValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required environment variables
  const requiredVars = [
    'NEXT_PUBLIC_WP_API_URL',
  ];

  // Check required variables
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`);
    }
  }

  // Validate WordPress API URL
  const wpApiUrl = process.env.NEXT_PUBLIC_WP_API_URL;
  if (wpApiUrl) {
    try {
      const url = new URL(wpApiUrl);
      if (!url.protocol.startsWith('https')) {
        warnings.push('WordPress API URL should use HTTPS in production');
      }
      if (!url.hostname.includes('plai.ac.id')) {
        warnings.push('WordPress API URL should point to plai.ac.id domain');
      }
    } catch {
      errors.push('NEXT_PUBLIC_WP_API_URL is not a valid URL');
    }
  }

  // Check for sensitive data in client-side env vars
  const clientEnvVars = Object.keys(process.env).filter(key =>
    key.startsWith('NEXT_PUBLIC_')
  );

  for (const varName of clientEnvVars) {
    const value = process.env[varName] || '';

    // Check for potential secrets in public env vars
    if (value.includes('secret') || value.includes('key') || value.includes('token')) {
      if (varName !== 'NEXT_PUBLIC_WP_API_URL') { // Allow this specific one
        warnings.push(`${varName} contains sensitive keywords - ensure it's safe to expose to client`);
      }
    }

    // Check for localhost in production
    if (process.env.NODE_ENV === 'production' && value.includes('localhost')) {
      errors.push(`${varName} contains localhost in production environment`);
    }
  }

  // Check asset prefix for security
  const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX;
  if (assetPrefix && !assetPrefix.startsWith('/')) {
    warnings.push('NEXT_PUBLIC_ASSET_PREFIX should be a relative path starting with /');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Get validated environment variable with fallback
 */
export function getValidatedEnv(key: string, fallback: string = ''): string {
  const value = process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} not set, using fallback`);
    return fallback;
  }
  return value;
}

/**
 * Secure environment variable getter that validates URLs
 */
export function getValidatedUrl(key: string, fallback: string = ''): string {
  const value = getValidatedEnv(key, fallback);
  if (!value) return fallback;

  try {
    const url = new URL(value);
    // Ensure HTTPS in production
    if (process.env.NODE_ENV === 'production' && !url.protocol.startsWith('https')) {
      console.warn(`${key} should use HTTPS in production`);
    }
    return value;
  } catch {
    console.error(`${key} is not a valid URL: ${value}`);
    return fallback;
  }
}