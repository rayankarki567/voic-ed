import { z } from 'zod'
import { passwordValidation } from './security-config'

// Password validation schema
const passwordSchema = z.string()
  .min(passwordValidation.minLength, `Password must be at least ${passwordValidation.minLength} characters`)
  .regex(/[A-Z]/, 'Password must contain at least one capital letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim() // Remove leading/trailing whitespace
    .slice(0, 1000) // Limit length
}

// Helper to validate and sanitize form data
export const validateAndSanitize = async <T extends z.ZodType>(
  schema: T,
  data: unknown
): Promise<z.infer<T>> => {
  const sanitizedData = Object.entries(data as Record<string, string>).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: typeof value === 'string' ? sanitizeInput(value) : value,
    }),
    {}
  )
  return schema.parseAsync(sanitizedData)
}
