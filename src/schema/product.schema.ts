import {
  pgTable,
  varchar,
  timestamp,
  serial,
  numeric,
  text,
} from 'drizzle-orm/pg-core'

import { z } from 'zod'
import { InferInsertModel } from 'drizzle-orm'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  images: varchar('images', { length: 10 }).notNull(),
  category_id: numeric('category_id').notNull(),
  weight: varchar('weight', { length: 50 }).notNull(),
  packaging: varchar('packaging', { length: 50 }).notNull(),
  tags: varchar('tags', { length: 10 }),
  ingredients: text('ingredients'),
  created_at: timestamp('created_at').defaultNow(),
})

// Zod schema for product creation
// export const createProductSchema = z.object({
//   name: z.string().min(1).max(255),
//   description: z.string().optional(),
//   price: z.number().positive(),
//   images: z.string().url().optional(),
//   //   catetory_id: z.number().min(1).max(100),
//   //   stock: z.number().int().min(0),
// })

export type CreateProductInput = InferInsertModel<typeof products>
