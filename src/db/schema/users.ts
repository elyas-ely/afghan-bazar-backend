import { sql } from 'drizzle-orm'
import { pgTable, varchar } from 'drizzle-orm/pg-core'
import { timestamps } from '../columns.helpers'

// USERS TABLE
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_name: varchar('user_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  profile: varchar('profile'),
  country: varchar('country'),
  phone_number: varchar('phone_number', { length: 20 }),
  ...timestamps,
})
