import { rateLimit } from 'express-rate-limit'
import { Redis } from '@upstash/redis'

// Initialize Redis for rate limiting and caching
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || '',
  token: process.env.UPSTASH_REDIS_TOKEN || ''
})

// Rate limiting configuration
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
})

// CSRF Token configuration
export const csrfConfig = {
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  },
  secret: process.env.CSRF_SECRET || 'your-csrf-secret',
}

// Security headers configuration
export const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co;
    font-src 'self';
    connect-src 'self' https://*.supabase.co https://apis.google.com;
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim(),
}

// Session configuration
export const sessionConfig = {
  maxAge: 24 * 60 * 60, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}
