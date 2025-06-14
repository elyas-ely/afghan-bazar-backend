import { db } from '../config/database'
import { desc, eq } from 'drizzle-orm'
import { reviews } from '../db/schema/reviews'
import { users } from '../db/schema/users'
import { products } from '../db/schema/products'

export async function getProductReviews(productId: number) {
  const data = await db
    .select({
      id: reviews.id,
      userName: users.username,
      rating: reviews.rating,
      comment: reviews.comment,
      images: reviews.images,
      productName: products.name,
      profile: users.profile,
      createdAt: reviews.created_at,
    })
    .from(reviews)
    .where(eq(reviews.product_id, productId))
    .innerJoin(products, eq(reviews.product_id, products.id))
    .innerJoin(users, eq(reviews.user_id, users.id))
    .groupBy(reviews.id, users.username, products.name, users.profile)
    .orderBy(desc(reviews.created_at))

  return data
}
