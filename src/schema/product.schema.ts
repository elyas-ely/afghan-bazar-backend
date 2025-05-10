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

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  images: text('images').array().notNull(),
  category_id: integer('category_id').notNull(),
  weight: varchar('weight', { length: 50 }).notNull(),
  packaging: varchar('packaging', { length: 50 }).notNull(),
  tags: text('tags').array(),
  ingredients: text('ingredients').array(),
  created_at: timestamp('created_at').defaultNow(),
})

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1),
  category_id: z.number().int().positive(),
  weight: z.string().min(1).max(50),
  packaging: z.string().min(1).max(50),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
})

export type CreateProductInput = InferInsertModel<typeof products>
