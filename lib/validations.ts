import { z } from 'zod'
import { type NextRequest, NextResponse } from 'next/server'

export type ValidationSchema = z.ZodType<any, any>

export function validateRequest(schema: ValidationSchema) {
  return async (request: NextRequest) => {
    try {
      const body = await request.json()
      return schema.parse(body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: error.errors
          },
          { status: 400 }
        )
      }
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }
  }
}

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  studentId: z.string().regex(/^[0-9]{3}[A-Za-z]+[0-9]{3}$/, 'Invalid student ID format'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
})

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name is required').optional(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  department: z.string().min(2, 'Department is required').optional(),
  year: z.string().min(1, 'Year is required').optional(),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
})

export const securitySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'students', 'private']),
  twoFactorEnabled: z.boolean(),
})
