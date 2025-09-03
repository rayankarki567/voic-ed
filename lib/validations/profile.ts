import { z } from 'zod'

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  studentId: z.string().regex(/^[0-9]{3}[A-Za-z]+[0-9]{3}$/, 'Invalid student ID format'),
  department: z.string().min(2, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format').optional(),
  address: z.string().min(5, 'Address must be at least 5 characters').optional(),
})

export const privacySettingsSchema = z.object({
  profile_visibility: z.enum(['public', 'students', 'private']),
  two_factor_enabled: z.boolean(),
})

export const notificationSettingsSchema = z.object({
  email_notifications: z.boolean(),
  survey_reminders: z.boolean(),
  petition_updates: z.boolean(),
  forum_replies: z.boolean(),
  voting_reminders: z.boolean(),
})

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain uppercase, lowercase, number and special character'
    ),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
