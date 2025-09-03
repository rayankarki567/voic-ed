import { z } from 'zod'

export const createPetitionSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  target_signatures: z.number().min(10, 'Target signatures must be at least 10')
})

export const updatePetitionSchema = createPetitionSchema.partial()
