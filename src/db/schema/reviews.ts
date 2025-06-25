import { sql } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  serial,
  text,
  integer,
  numeric,
  index,
} from 'drizzle-orm/pg-core'
import { products } from './products'
import { users } from './users'
import { timestamps } from '../columns.helpers'

// REVIEWS TABLE
export const reviews = pgTable(
  'reviews',
  {
    id: serial('id').primaryKey(),
    product_id: integer('product_id')
      .notNull()
      .references(() => products.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    user_id: varchar('user_id', { length: 255 })
      .notNull()
      .references(() => users.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    rating: numeric('rating', { precision: 2, scale: 1 }).notNull(),

    images: text('images')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    comment: text('comment').notNull(),
    ...timestamps,
  },
  (table) => ({
    idxProduct: index('idx_reviews_product_id').on(table.product_id),
  })
)
