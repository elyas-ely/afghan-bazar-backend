import { Context } from 'hono'
import {
  getProductReviews,
  getReviewsCountByRating,
} from '../services/review.service'
import { createReviewSchema } from '../schema/review.schema'
import { db } from '../config/database'
import { reviews } from '../db/schema/reviews'

export async function getProductReviewFn(c: Context) {
  const productId = Number(c.req.param('id'))

  if (!productId) {
    return c.json(
      {
        success: 'false',
        message: 'Product ID is required',
      },
      400
    )
  }

  try {
    const reviews = await getProductReviews(productId)
    return c.json({
      success: 'true',
      reviews,
    })
  } catch (error) {
    console.error(error)
    return c.json(
      {
        success: 'false',
        message: 'Internal Server Error',
      },
      500
    )
  }
}

export async function getReviewsCountByRatingFn(c: Context) {
  const productId = Number(c.req.param('id'))

  if (!productId) {
    return c.json(
      {
        success: 'false',
        message: 'Product ID is required',
      },
      400
    )
  }

  try {
    const reviews = await getReviewsCountByRating(productId)
    return c.json({
      success: 'true',
      reviews,
    })
  } catch (error) {
    console.error(error)
    return c.json(
      {
        success: 'false',
        message: 'Internal Server Error',
      },
      500
    )
  }
}

export async function createProductReviewFn(c: Context) {
  const body = await c.req.json()

  if (!body?.product_id || !body?.user_id || !body?.rating || !body?.comment) {
    return c.json(
      {
        success: 'false',
        message: 'Product ID, User ID, Rating, and Comment are required',
      },
      400
    )
  }

  const validatedData = createReviewSchema.parse(body)

  console.log(validatedData)

  try {
    // Insert into database
    await db.insert(reviews).values(validatedData).returning()

    return c.json(
      {
        success: true,
        message: 'Review created successfully',
        review: 'hhj',
      },
      201
    )
  } catch (error) {
    console.error('Error creating review:', error)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
        details: String(error),
      },
      500
    )
  }
}
