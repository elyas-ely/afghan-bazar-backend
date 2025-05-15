import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const user_addresses = pgTable('user_addresses', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  address1: varchar('address1', { length: 255 }),
  address2: varchar('address2', { length: 255 }),
  zipcode: varchar('zipcode', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
})

export const createUserAddressSchema = z.object({
  user_id: z.string(),
  address1: z.string(),
  address2: z.string(),
  zipcode: z.string(),
})

// Update schema with all fields optional for partial updates
export const updateUserAddressSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  zipcode: z.string().optional(),
})
