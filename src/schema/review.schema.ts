import {
  pgTable,
  varchar,
  timestamp,
  serial,
  numeric,
  text,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core'

import { z } from 'zod'
import { InferInsertModel } from 'drizzle-orm'

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  rating: numeric('rating').notNull(),
  comment: text('comment').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})
