import { NextResponse } from 'next/server'
import { ZodError, z } from 'zod'
import { ApiResponseSchema } from '@/types/api'
import { redis } from '@/lib/security'

export type ApiHandler = (
  req: Request,
  context: { params: Record<string, string> }
) => Promise<NextResponse>

export const withValidation = (schema: z.Schema, handler: ApiHandler): ApiHandler => {
  return async (req: Request, context) => {
    try {
      const body = await req.json()
      await schema.parseAsync(body)
      return handler(req, context)
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            errors: error.errors,
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        {
          success: false,
          message: 'Internal server error',
        },
        { status: 500 }
      )
    }
  }
}

export const withCache = (
  handler: ApiHandler,
  options: { ttl: number; keyPrefix: string }
): ApiHandler => {
  return async (req: Request, context) => {
    const url = new URL(req.url)
    const cacheKey = `${options.keyPrefix}:${url.pathname}${url.search}`

    // Only cache GET requests
    if (req.method === 'GET') {
      const cached = await redis.get(cacheKey)
      if (cached && typeof cached === 'string') {
        return NextResponse.json(JSON.parse(cached))
      }
    }

    const response = await handler(req, context)
    const data = await response.json()

    if (req.method === 'GET' && response.status === 200) {
      await redis.set(cacheKey, JSON.stringify(data), { ex: options.ttl })
    }

    return NextResponse.json(data, { status: response.status })
  }
}

export const withErrorHandling = (handler: ApiHandler): ApiHandler => {
  return async (req: Request, context) => {
    try {
      const response = await handler(req, context)
      return response
    } catch (error) {
      console.error('API Error:', error)
      return NextResponse.json(
        {
          success: false,
          message: 'Internal server error',
        },
        { status: 500 }
      )
    }
  }
}

export const withRateLimit = (
  handler: ApiHandler,
  options: { limit: number; window: number }
): ApiHandler => {
  return async (req: Request, context) => {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const key = `rate-limit:${ip}:${req.url}`

    const current = await redis.incr(key)
    if (current === 1) {
      await redis.expire(key, options.window)
    }

    if (current > options.limit) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many requests',
        },
        { status: 429 }
      )
    }

    return handler(req, context)
  }
}
