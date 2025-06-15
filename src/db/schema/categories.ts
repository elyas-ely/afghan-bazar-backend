import { pgTable, varchar, serial } from 'drizzle-orm/pg-core'
import { timestamps } from '../columns.helpers'

// CATEGORIES TABLE
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 250 }).notNull(),
  ...timestamps,
})
