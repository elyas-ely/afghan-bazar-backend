import { Context } from 'hono'
import { createReviewSchema, updateReviewSchema } from '../schema/review.schema'
import { reviews } from '../db/schema/reviews'
import { users } from '../db/schema/users'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../config/database'
import { z } from 'zod'
import { getProductReviews } from '../services/review.service'

export async function getProductReview(c: Context) {
  const productId = Number(c.req.param('id'))

  if (!productId) {
    return c.json({ error: 'Product ID is required' }, 400)
  }

  try {
    const { data, count } = await getProductReviews(productId)
    return c.json({ data, count })
  } catch (error) {
    console.log(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getProductReviewById(c: Context) {
  const productId = Number(c.req.param('id'))
  const reviewId = Number(c.req.param('reviewId'))

  if (!productId || !reviewId) {
    return c.json({ error: 'Product ID and Review ID are required' }, 400)
  }

  try {
    const data = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        userName: users.username,
        profile: users.profile,
        comment: reviews.comment,
        createdAt: reviews.created_at,
      })
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.product_id, productId)))
      .innerJoin(users, eq(reviews.user_id, users.id))
      .orderBy(desc(reviews.created_at))
      .limit(10)
      .offset(0)

    return c.json(data)
  } catch (error) {
    console.log(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

// Create a review
export async function createProductReview(c: Context) {
  const body = await c.req.json()

  try {
    const validatedData = createReviewSchema.parse(body)

    // Insert into database
    // const newReview = await db.insert(reviews).values(validatedData).returning()

    return c.json(
      { message: 'Review created successfully', review: 'hhj' },
      201
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return c.json(
      { error: 'Internal Server Error', details: String(error) },
      500
    )
  }
}

// Update a review
export async function updateProductReview(c: Context) {
  const productId = Number(c.req.param('id'))
  const reviewId = Number(c.req.param('reviewId'))

  if (!productId || !reviewId) {
    return c.json({ error: 'Product ID and Review ID are required' }, 400)
  }

  // Validate the request body
  const reviewUpdateSchema = z
    .object({
      rating: z
        .number()
        .min(1)
        .max(5, 'Rating must be between 1 and 5')
        .optional(),
      comment: z.string().min(1, 'Comment is required').optional(),
      user_id: z.string().min(1).optional(), // For verification purposes
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided to update',
    })

  try {
    const body = await c.req.json()
    const validatedData = updateReviewSchema.parse(body)

    // Check if the review exists and belongs to the user (if user_id is provided)
    const existingReview = await db
      .select()
      .from(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.product_id, productId)))
      .limit(1)

    if (existingReview.length === 0) {
      return c.json({ error: 'Review not found' }, 404)
    }

    // If user_id is provided, verify that the review belongs to this user
    // if (
    //   validatedData.user_id &&
    //   existingReview[0].user_id !== validatedData.user_id
    // ) {
    //   return c.json(
    //     { error: 'You are not authorized to update this review' },
    //     403
    //   )
    // }

    // Prepare update data (excluding user_id from updates)
    const updateData: { rating?: string; comment?: string; updated_at: Date } =
      {
        updated_at: new Date(),
      }

    if (validatedData.rating !== undefined) {
      updateData.rating = String(validatedData.rating)
    }

    if (validatedData.comment !== undefined) {
      updateData.comment = validatedData.comment
    }

    // Update the review
    const updatedReview = await db
      .update(reviews)
      .set(updateData)
      .where(and(eq(reviews.id, reviewId), eq(reviews.product_id, productId)))
      .returning()

    return c.json({
      message: 'Review updated successfully',
      review: updatedReview[0],
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: error.errors }, 400)
    }
    console.log(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

// Delete a review
export async function deleteProductReview(c: Context) {
  const productId = Number(c.req.param('id'))
  const reviewId = Number(c.req.param('reviewId'))

  if (!productId || !reviewId) {
    return c.json({ error: 'Product ID and Review ID are required' }, 400)
  }

  try {
    // Optionally validate user ownership (can be extended based on requirements)
    const body = await c.req.json().catch(() => ({}))
    const userId = body.user_id

    // If userId is provided, verify ownership
    if (userId) {
      const existingReview = await db
        .select()
        .from(reviews)
        .where(and(eq(reviews.id, reviewId), eq(reviews.product_id, productId)))
        .limit(1)

      if (existingReview.length === 0) {
        return c.json({ error: 'Review not found' }, 404)
      }

      if (existingReview[0].user_id !== userId) {
        return c.json(
          { error: 'You are not authorized to delete this review' },
          403
        )
      }
    }

    // Delete the review
    const deletedReview = await db
      .delete(reviews)
      .where(and(eq(reviews.id, reviewId), eq(reviews.product_id, productId)))
      .returning()

    if (deletedReview.length === 0) {
      return c.json({ error: 'Review not found' }, 404)
    }

    return c.json({ message: 'Review deleted successfully' })
  } catch (error) {
    console.log(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
