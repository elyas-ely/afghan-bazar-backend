import { z } from 'zod'
import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { reviews } from '../db/schema/reviews'

// Database table definition

// TypeScript types
export type Review = InferSelectModel<typeof reviews>
export type NewReview = InferInsertModel<typeof reviews>

// Zod validation schema for creating a review
export const createReviewSchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  product_id: z.number().min(1, 'Product ID is required'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  images: z.array(z.string().url()).optional(),
  comment: z.string().min(1, 'Comment is required'),
})

// Zod validation schema for updating a review
export const updateReviewSchema = z
  .object({
    rating: z
      .number()
      .min(1)
      .max(5, 'Rating must be between 1 and 5')
      .optional(),
    images: z.array(z.string().url()).min(1).optional(),
    comment: z.string().min(1, 'Comment is required').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  })

// Type for the validated data when updating a review
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>
