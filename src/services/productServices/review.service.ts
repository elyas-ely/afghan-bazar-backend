import { db } from '../../config/database'
import { and, desc, eq, sql } from 'drizzle-orm'
import { reviews } from '../../db/schema/reviews'
import { users } from '../../db/schema/users'
import { products } from '../../db/schema/products'

export async function getProductReviews(
  productId: number,
  offset: number,
  limit: number
) {
  const [data, countResult] = await Promise.all([
    db
      .select({
        id: reviews.id,
        user_name: users.user_name,
        user_id: users.id,
        country: users.country,
        rating: reviews.rating,
        comment: reviews.comment,
        images: reviews.images,
        product_id: reviews.product_id,
        profile: users.profile,
        updated_at: reviews.updated_at,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .where(eq(reviews.product_id, productId))
      .innerJoin(users, eq(reviews.user_id, users.id))
      .orderBy(desc(reviews.created_at))
      .limit(limit)
      .offset(offset),

    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(reviews)
      .where(eq(reviews.product_id, productId)),
  ])
  const total = countResult[0]?.count ?? 0
  const hasNextPage = offset + limit < total
  return {
    data,
    hasNextPage,
  }
}

export async function getProductMiniReviews(productId: number, limit: number) {
  const [data, countResult] = await Promise.all([
    db
      .select({
        id: reviews.id,
        user_name: users.user_name,
        user_id: users.id,
        country: users.country,
        rating: reviews.rating,
        comment: reviews.comment,
        images: reviews.images,
        product_id: reviews.product_id,
        profile: users.profile,
        updated_at: reviews.updated_at,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .where(eq(reviews.product_id, productId))
      .innerJoin(users, eq(reviews.user_id, users.id))
      .orderBy(desc(reviews.created_at))
      .limit(limit),

    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(reviews)
      .where(eq(reviews.product_id, productId)),
  ])
  const total = countResult[0]?.count ?? 0
  return {
    data,
    count: total,
  }
}

export async function getReviewsCountByRating(productId: number) {
  const result = await db
    .select({
      rating: reviews.rating,
      count: sql<number>`COUNT(*)`,
    })
    .from(reviews)
    .where(eq(reviews.product_id, productId))
    .groupBy(reviews.rating)

  // Normalize into all 5 buckets (fill missing with 0)
  const ratingCounts = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
  }

  for (const row of result) {
    if (Number(row.rating) === 1) ratingCounts.one = row.count
    else if (Number(row.rating) === 2) ratingCounts.two = row.count
    else if (Number(row.rating) === 3) ratingCounts.three = row.count
    else if (Number(row.rating) === 4) ratingCounts.four = row.count
    else if (Number(row.rating) === 5) ratingCounts.five = row.count
  }

  return ratingCounts
}

export async function getProductReviewById(reviewId: number) {
  const result = await db
    .select()
    .from(reviews)
    .where(and(eq(reviews.id, reviewId)))

  return result[0]
}

export async function updateReview(reviewId: number, data: any) {
  const result = await db
    .update(reviews)
    .set(data)
    .where(eq(reviews.id, reviewId))
    .returning()

  return result[0]
}

export async function createReview(data: any) {
  const result = await db.insert(reviews).values(data).returning()

  return result[0]
}

export async function deleteReview(reviewId: number, userId: string) {
  const result = await db
    .delete(reviews)
    .where(and(eq(reviews.id, reviewId), eq(reviews.user_id, userId)))
    .returning()

  return result[0]
}
