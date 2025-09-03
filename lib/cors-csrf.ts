import { env } from './env'
import { type NextRequest, NextResponse } from 'next/server'

// CORS Configuration
export const corsConfig = {
  origin: env.NODE_ENV === 'production' 
    ? [env.APP_URL] // Only allow our domain in production
    : ['http://localhost:3000'], // Allow localhost in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-CSRF-Token',
  ],
  credentials: true,
  maxAge: 86400, // 24 hours
}

// CSRF token generation with double submit cookie pattern
export async function generateCsrfToken() {
  const token = crypto.randomUUID()
  return token
}

// Middleware to validate CSRF token
export async function validateCsrfToken(request: NextRequest) {
  const token = request.headers.get('X-CSRF-Token')
  const cookieToken = request.cookies.get('csrf-token')?.value

  if (!token || !cookieToken || token !== cookieToken) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid CSRF token' }), 
      { status: 403 }
    )
  }

  return NextResponse.next()
}

// Middleware to set CSRF token
export async function setCsrfToken(request: NextRequest) {
  const token = await generateCsrfToken()
  const response = NextResponse.next()

  response.cookies.set('csrf-token', token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  return response
}

// Helper to check if request needs CSRF protection
export function requiresCsrfCheck(request: NextRequest) {
  const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS']
  return !SAFE_METHODS.includes(request.method)
}
