import { Context } from 'hono'
import {
  createReviewSchema,
  updateReviewSchema,
} from '../../schema/review.schema'

import {
  createReview,
  deleteReview,
  getProductReviewById,
  getProductReviews,
  getReviewsCountByRating,
  updateReview,
} from '../../services/productServices/review.service'

export async function getProductReviewFn(c: Context) {
  const productId = Number(c.req.param('pId'))

  if (!productId) {
    return c.json(
      {
        success: false,
        message: 'Product ID is required',
      },
      400
    )
  }

  try {
    const { data, count } = await getProductReviews(productId)
    return c.json({
      success: true,
      reviews: data,
      count,
    })
  } catch (error) {
    console.log(error)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      500
    )
  }
}

export async function getProductReviewByIdFn(c: Context) {
  const productId = Number(c.req.param('pId'))
  const reviewId = Number(c.req.param('rId'))

  if (!productId || !reviewId) {
    return c.json(
      {
        success: false,
        message: 'Product ID and Review ID are required',
      },
      400
    )
  }

  try {
    const data = await getProductReviewById(reviewId)

    return c.json({
      success: true,
      review: data,
    })
  } catch (error) {
    console.log(error)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      500
    )
  }
}

export async function getReviewsCountByRatingFn(c: Context) {
  const productId = Number(c.req.param('pId'))

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

// Create a review
export async function createProductReviewFn(c: Context) {
  const body = await c.req.json()

  if (!body?.user_id || !body?.product_id || !body?.rating || !body?.comment) {
    return c.json(
      {
        success: false,
        message: 'User ID, Product ID, Rating, Comment are required',
      },
      400
    )
  }

  try {
    const validatedData = createReviewSchema.parse(body)

    const data = await createReview(validatedData)

    return c.json(
      {
        success: true,
        message: 'Review created successfully',
        review: data,
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

// Update a review
export async function updateProductReviewFn(c: Context) {
  const productId = Number(c.req.param('pId'))
  const reviewId = Number(c.req.param('rId'))

  if (!productId || !reviewId) {
    return c.json(
      {
        success: false,
        message: 'Product ID and Review ID are required',
      },
      400
    )
  }

  try {
    const body = await c.req.json()
    const validatedData = updateReviewSchema.parse(body)

    const data = await updateReview(reviewId, validatedData)

    return c.json({
      success: true,
      message: 'Review updated successfully',
      review: data,
    })
  } catch (error) {
    console.error('Error updating review:', error)
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

// Delete a review
export async function deleteProductReviewFn(c: Context) {
  const productId = Number(c.req.param('pId'))
  const reviewId = Number(c.req.param('rId'))
  const userId = String(c.req.queries('userId'))

  if (!productId || !reviewId || !userId) {
    return c.json(
      {
        success: false,
        message: 'Product ID and Review ID are required',
      },
      400
    )
  }

  try {
    await deleteReview(reviewId, userId)

    return c.json(
      {
        success: true,
        message: 'Review deleted successfully',
      },
      200
    )
  } catch (error) {
    console.log(error)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      500
    )
  }
}
