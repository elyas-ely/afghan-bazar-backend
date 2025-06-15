import { sql } from 'drizzle-orm'
import {
  pgTable,
  varchar,
  serial,
  text,
  integer,
  boolean,
  numeric,
  index,
} from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { timestamps } from '../columns.helpers'

// PRODUCTS TABLE
export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: numeric('price', { precision: 10, scale: 1 }).notNull(),
    popular: boolean('popular').default(false),
    price_unit: varchar('price_unit', { length: 50 }),
    weights: integer('weights').array(),
    features: text('features').array(),
    origin: varchar('origin', { length: 100 }),
    instructions: text('instructions'),
    images: text('images')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    category_id: integer('category_id')
      .notNull()
      .references(() => categories.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ...timestamps,
  },
  (table) => ({
    idxCategory: index('idx_products_category_id').on(table.category_id),
    idxPopular: index('idx_products_popular').on(table.popular),
    idxName: index('idx_products_name').on(table.name),
  })
)
