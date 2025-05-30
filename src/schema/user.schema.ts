import { pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'
import { InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  profile: varchar('profile'),
  country: varchar('country'),
  phone_number: varchar('phone_number', { length: 20 }),
  created_at: timestamp('created_at').defaultNow(),
})

// Zod schema for runtime validation
export const createUserSchema = z.object({
  id: z.string(),
  username: z.string().min(1).max(255),
  email: z.string().email().max(255),
  country: z.string().max(255),
  profile: z.string().optional(),
})

// Update schema with all fields optional for partial updates
export const updateUserSchema = z.object({
  username: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  country: z.string().max(255).optional(),
  profile: z.string().optional(),
  phone_number: z.string().max(20).optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>
