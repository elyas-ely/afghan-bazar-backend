// reviews

import { Context } from 'hono'
import { reviews } from '../schema/review.schema'
import { users } from '../schema/user.schema'
import { and, desc, eq } from 'drizzle-orm'
import { db } from '../config/database'

export async function getProductReview(c: Context) {
  const productId = Number(c.req.param('id'))

  if (!productId) {
    return c.json({ error: 'Product ID is required' }, 400)
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
      .where(eq(reviews.product_id, productId))
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
