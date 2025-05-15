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
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'

// Database table definition
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  product_id: integer('product_id').notNull(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  rating: numeric('rating').notNull(),
  comment: text('comment').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
})

// TypeScript types
export type Review = InferSelectModel<typeof reviews>
export type NewReview = InferInsertModel<typeof reviews>

// Zod validation schema for creating a review
export const createReviewSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  product_id: z.number().min(1, 'Product ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(1, 'Comment is required'),
})

// Type for the validated data when creating a review
export type CreateReviewInput = z.infer<typeof createReviewSchema>

// Zod validation schema for updating a review
export const updateReviewSchema = z
  .object({
    rating: z
      .number()
      .min(1)
      .max(5, 'Rating must be between 1 and 5')
      .optional(),
    comment: z.string().min(1, 'Comment is required').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  })

// Type for the validated data when updating a review
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
