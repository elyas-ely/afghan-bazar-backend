import { db } from '../config/database'
import { desc, eq, sql } from 'drizzle-orm'
import { reviews } from '../db/schema/reviews'
import { users } from '../db/schema/users'
import { products } from '../db/schema/products'

export async function getProductReviews(productId: number) {
  const [data, countResult] = await Promise.all([
    db
      .select({
        id: reviews.id,
        user_name: users.username,
        country: users.country,
        rating: reviews.rating,
        comment: reviews.comment,
        images: reviews.images,
        product_name: products.name,
        profile: users.profile,
        updated_at: reviews.updated_at,
        created_at: reviews.created_at,
      })
      .from(reviews)
      .where(eq(reviews.product_id, productId))
      .innerJoin(users, eq(reviews.user_id, users.id))
      .innerJoin(products, eq(reviews.product_id, products.id))
      .orderBy(desc(reviews.created_at))
      .limit(10)
      .offset(0),

    db
      .select({ count: sql<number>`COUNT(*)` })
      .from(reviews)
      .where(eq(reviews.product_id, productId)),
  ])

  return {
    data,
    count: countResult[0]?.count ?? 0,
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
