import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { securityHeaders, cookieOptions } from '@/lib/security-config'
import { rateLimit } from 'express-rate-limit'
import { Redis } from '@upstash/redis'
import { corsConfig, validateCsrfToken, setCsrfToken, requiresCsrfCheck } from '@/lib/cors-csrf'

// Initialize rate limiter with Redis (optional for development)
const redis = process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_URL,
      token: process.env.UPSTASH_REDIS_TOKEN
    })
  : null

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })
  
  // Additional security headers
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=())')

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 })
    
    // Set CORS headers
    response.headers.set('Access-Control-Allow-Origin', corsConfig.origin.join(', '))
    response.headers.set('Access-Control-Allow-Methods', corsConfig.methods.join(', '))
    response.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '))
    response.headers.set('Access-Control-Max-Age', corsConfig.maxAge.toString())
    
    if (corsConfig.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true')
    }
    
    return response
  }

  // Apply CORS headers to all responses
  res.headers.set('Access-Control-Allow-Origin', corsConfig.origin.join(', '))
  res.headers.set('Access-Control-Allow-Methods', corsConfig.methods.join(', '))
  res.headers.set('Access-Control-Allow-Headers', corsConfig.allowedHeaders.join(', '))
  
  if (corsConfig.credentials) {
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Rate limiting for auth endpoints
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    if (redis) {
      const ip = req.headers.get('x-forwarded-for') || 'unknown'
      const key = `rate-limit:${ip}:${req.nextUrl.pathname}`
      const current = await redis.incr(key)
      
      if (current === 1) {
        await redis.expire(key, 60 * 15) // 15 minutes window
      }
      
      if (current > 100) { // 100 requests per 15 minutes
        return new NextResponse('Too Many Requests', { status: 429 })
      }
    }
  }

  // Get session from Supabase with timeout
  let session = null
  try {
    const sessionPromise = supabase.auth.getSession()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Session check timeout')), 5000)
    )
    
    const result = await Promise.race([sessionPromise, timeoutPromise]) as any
    session = result.data?.session
  } catch (error) {
    console.error('Session check failed:', error)
    // Continue without session to avoid blocking the request
  }

  // If user is not signed in and the current path is protected, redirect to /login
  const protectedPaths = ['/dashboard']
  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))
  
  if (!session && isProtectedPath) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is signed in and trying to access login/register, redirect to dashboard
  if (session && ['/login', '/register'].includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Set CSRF token for GET requests to API endpoints
  if (req.nextUrl.pathname.startsWith('/api') && req.method === 'GET') {
    return setCsrfToken(req)
  }

  // Validate CSRF token for unsafe methods to API endpoints
  if (req.nextUrl.pathname.startsWith('/api') && requiresCsrfCheck(req)) {
    return validateCsrfToken(req)
  }

  return res
}

// Match all paths except static assets and API routes for auth middleware
// Match API routes for CORS and CSRF
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ]
}
