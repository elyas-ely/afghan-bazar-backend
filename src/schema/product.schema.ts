import {
  pgTable,
  varchar,
  timestamp,
  serial,
  numeric,
  text,
  integer,
  boolean,
} from 'drizzle-orm/pg-core'

import { z } from 'zod'
import { InferInsertModel } from 'drizzle-orm'

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  popular: boolean('popular').default(false),
  price_unit: varchar('price_unit', { length: 50 }),
  weights: varchar('weights', { length: 10 }).array(),
  features: text('features').array(),
  origin: varchar('origin', { length: 100 }),
  instructions: text('instructions'),
  images: text('images').array().notNull(),
  category_id: integer('category_id').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

// Define the schema for validation with number type for price
export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  price: z.number().positive(), // Keep as number for user input validation
  images: z.array(z.string().url()).min(1),
  category_id: z.number().int().positive(),
  price_unit: z.string().min(1).max(50),
  weights: z.array(z.string().min(1).max(10)),
  features: z.array(z.string()),
  origin: z.string().min(1).max(100),
  instructions: z.string(),
})

// Update schema with all fields optional for partial updates
export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(), // Keep as number for validation
  images: z.array(z.string().url()).min(1).optional(),
  category_id: z.number().int().positive().optional(),
  price_unit: z.string().min(1).max(50).optional(),
  weights: z.array(z.string().min(1).max(10)).optional(),
  features: z.array(z.string()).optional(),
  origin: z.string().min(1).max(100).optional(),
  instructions: z.string().optional(),
})
