import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const users = pgTable('users', {
  user_id: varchar('user_id', { length: 255 }).notNull().primaryKey(),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  bio: varchar('bio', { length: 255 }),
  seller: boolean('seller').notNull().default(false),
  profile: varchar('profile'),
  background: varchar('background'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const createUserSchema = z.object({
  username: z.string().min(1).max(255),
  email: z.string().email().max(255),
  bio: z.string().max(255).optional(),
  seller: z.boolean().default(false),
  profile: z.string().optional(),
  background: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
