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
