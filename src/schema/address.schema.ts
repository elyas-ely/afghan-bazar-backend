import { boolean } from 'drizzle-orm/pg-core'
import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core'
import { z } from 'zod'

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  address_name: varchar('address_name', { length: 255 }).notNull(),
  full_name: varchar('full_name', { length: 255 }).notNull(),
  street_address: varchar('street_address', { length: 255 }).notNull(),
  apartment: varchar('apartment', { length: 255 }),
  city: varchar('city', { length: 255 }).notNull(),
  province: varchar('province', { length: 255 }).notNull(),
  state: varchar('state', { length: 255 }),
  zip_code: varchar('zip_code', { length: 255 }).notNull(),
  country: varchar('country', { length: 255 }).notNull(),
  phone_number: varchar('phone_number', { length: 255 }).notNull(),
  is_default: boolean('is_default').default(false),
  created_at: timestamp('created_at').defaultNow(),
})

export const createUserAddressSchema = z.object({
  user_id: z.string(),
  address_name: z.string(),
  full_name: z.string(),
  street_address: z.string(),
  apartment: z.string(),
  city: z.string(),
  province: z.string(),
  state: z.string(),
  zip_code: z.string(),
  country: z.string(),
  phone_number: z.string(),
})

// Update schema with all fields optional for partial updates
export const updateUserAddressSchema = z.object({
  address_name: z.string().optional(),
  full_name: z.string().optional(),
  street_address: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  phone_number: z.string().optional(),
})
