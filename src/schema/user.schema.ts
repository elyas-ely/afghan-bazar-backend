import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { InferInsertModel } from 'drizzle-orm'
import { z } from 'zod'

export const users = pgTable('users', {
  user_id: varchar('user_id', { length: 255 }).primaryKey(), // ✅ now a UUID string
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  bio: varchar('bio', { length: 255 }),
  seller: boolean('seller').notNull().default(false),
  profile: varchar('profile'),
  background: varchar('background'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Zod schema for runtime validation
export const createUserSchema = z.object({
  user_id: z.string(), // ✅ must now be provided and must be a valid UUID
  username: z.string().min(1).max(255),
  email: z.string().email().max(255),
  bio: z.string().max(255).nullable().optional(),
  seller: z.boolean().default(false),
  profile: z.string().optional(),
  background: z.string().optional(),
})

// ✅ This matches the shape expected by db.insert(users).values()
export type CreateUserInput = InferInsertModel<typeof users>
