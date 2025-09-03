import { z } from 'zod'

// Base response type for all API responses
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
})

// Profile types
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  student_id: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  year_level: z.string().min(1, 'Year level is required'),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Petition types
export const PetitionSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  target_signatures: z.number().min(1, 'Target signatures must be at least 1'),
  current_signatures: z.number().default(0),
  status: z.enum(['pending', 'active', 'closed']).default('pending'),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Survey types
export const SurveyQuestionSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1, 'Question is required'),
  type: z.enum(['text', 'single', 'multiple']),
  options: z.array(z.string()).optional(),
  required: z.boolean().default(false),
})

export const SurveySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  questions: z.array(SurveyQuestionSchema),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  status: z.enum(['draft', 'active', 'closed']).default('draft'),
  user_id: z.string().uuid(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// User preferences types
export const UserPreferencesSchema = z.object({
  user_id: z.string().uuid(),
  email_notifications: z.boolean().default(true),
  survey_reminders: z.boolean().default(true),
  petition_updates: z.boolean().default(true),
  forum_replies: z.boolean().default(true),
  voting_reminders: z.boolean().default(true),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

// Types for API requests
export const CreatePetitionRequestSchema = PetitionSchema.omit({
  id: true,
  current_signatures: true,
  status: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})

export const CreateSurveyRequestSchema = SurveySchema.omit({
  id: true,
  status: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})

// Types for API responses
export const PetitionResponseSchema = ApiResponseSchema.extend({
  data: PetitionSchema.optional(),
})

export const SurveyResponseSchema = ApiResponseSchema.extend({
  data: SurveySchema.optional(),
})

export const ProfileResponseSchema = ApiResponseSchema.extend({
  data: ProfileSchema.optional(),
})
