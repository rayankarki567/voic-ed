// Strong Content Security Policy and security headers configuration
export const securityHeaders = {
  // Prevent XSS attacks
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.supabase.co;
    font-src 'self';
    connect-src 'self' https://*.supabase.co https://apis.google.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim(),
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable strict SSL
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Control browser features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // Control referrer information
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // XSS protection as backup
  'X-XSS-Protection': '1; mode=block'
}

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
}

// Cookie security configuration
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// Password validation rules
export const passwordValidation = {
  minLength: 12,
  requireCapital: true,
  requireNumber: true,
  requireSpecialChar: true,
}

// Session configuration
export const sessionConfig = {
  maxAge: 24 * 60 * 60, // 24 hours
  rotateEvery: 60 * 60, // Rotate token every hour
  renewalThreshold: 30 * 60, // Renew if less than 30 minutes left
}
