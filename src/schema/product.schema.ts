import {
  pgTable,
  varchar,
  timestamp,
  serial,
  numeric,
  text,
  integer,
} from 'drizzle-orm/pg-core'

import { z } from 'zod'
import { InferInsertModel } from 'drizzle-orm'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  images: text('images').array().notNull(),
  category_id: integer('category_id').notNull(),
  weight: varchar('weight', { length: 50 }).notNull(),
  packaging: varchar('packaging', { length: 50 }).notNull(),
  tags: text('tags').array(),
  ingredients: text('ingredients').array(),
  created_at: timestamp('created_at').defaultNow(),
})

// Define the schema for validation with number type for price
export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  price: z.number().positive(), // Keep as number for user input validation
  images: z.array(z.string().url()).min(1),
  category_id: z.number().int().positive(),
  weight: z.string().min(1).max(50),
  packaging: z.string().min(1).max(50),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
})

// Update schema with all fields optional for partial updates
export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(), // Keep as number for validation
  images: z.array(z.string().url()).min(1).optional(),
  category_id: z.number().int().positive().optional(),
  weight: z.string().min(1).max(50).optional(),
  packaging: z.string().min(1).max(50).optional(),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
})
