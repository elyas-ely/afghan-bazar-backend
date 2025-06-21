import { z } from 'zod'

// Zod schema for runtime validation
export const createUserSchema = z.object({
  id: z.string(),
  user_name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  country: z.string().max(255),
  profile: z.string().optional(),
  phone_number: z.string().optional(),
})

// Update schema with all fields optional for partial updates
export const updateUserSchema = z.object({
  user_name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  country: z.string().max(255).optional(),
  profile: z.string().optional(),
  phone_number: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
