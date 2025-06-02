import { pgTable, varchar, timestamp, serial } from 'drizzle-orm/pg-core'

export const viewed_products = pgTable('viewed_products', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  product_id: serial('product_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})
