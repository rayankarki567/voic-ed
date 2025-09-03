import { z } from 'zod'

// Environment variable validation schema
const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Redis for rate limiting and caching (optional for development)
  UPSTASH_REDIS_URL: z.string().url().optional(),
  UPSTASH_REDIS_TOKEN: z.string().min(1).optional(),
  
  // Security (optional for development)
  CSRF_SECRET: z.string().min(1).optional(),
  
  // Email service (optional for development)
  EMAIL_SERVER_HOST: z.string().min(1).optional(),
  EMAIL_SERVER_PORT: z.string().transform(Number).optional(),
  EMAIL_SERVER_USER: z.string().min(1).optional(),
  EMAIL_SERVER_PASSWORD: z.string().min(1).optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // App configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url().optional(),
})

// Function to validate environment variables
export function validateEnv() {
  try {
    const parsed = envSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
      UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
      CSRF_SECRET: process.env.CSRF_SECRET,
      EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
      EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
      EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
      EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
      EMAIL_FROM: process.env.EMAIL_FROM,
      NODE_ENV: process.env.NODE_ENV || 'development',
      APP_URL: process.env.APP_URL,
    })
    return { parsed, success: true as const }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(issue => issue.path.join('.'))
      console.error('❌ Invalid environment variables:', missingVars)
      throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`)
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv().parsed
