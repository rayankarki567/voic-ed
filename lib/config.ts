/**
 * Application configuration constants
 */

/**
 * Get the base URL for the application
 * In production (Vercel), uses the production URL
 * In development, uses localhost
 */
export function getBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In production, use the production URL
    if (window.location.hostname === 'voic-ed.vercel.app') {
      return 'https://voic-ed.vercel.app'
    }
    // In development or other environments, use current origin
    return window.location.origin
  }
  
  // Server-side: prioritize environment variable, then detect production
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  return process.env.NODE_ENV === 'production' || process.env.VERCEL_URL
    ? 'https://voic-ed.vercel.app'
    : 'http://localhost:3000'
}

/**
 * Get the redirect URL for authentication callbacks
 */
export function getAuthCallbackUrl(): string {
  return `${getBaseUrl()}/auth/callback`
}

/**
 * Get the redirect URL for email confirmations
 */
export function getEmailConfirmUrl(): string {
  return `${getBaseUrl()}/auth/confirm`
}

/**
 * Production domain check
 */
export function isProduction(): boolean {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'voic-ed.vercel.app'
  }
  return process.env.NODE_ENV === 'production' || 
         process.env.VERCEL_URL?.includes('voic-ed.vercel.app') ||
         false
}
