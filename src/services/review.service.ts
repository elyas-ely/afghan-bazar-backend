import { db } from '../config/database'
import { desc, eq } from 'drizzle-orm'
import { reviews } from '../schema/review.schema'
import { products } from '../schema/product.schema'
import { users } from '../schema/user.schema'

export async function getProductReviews(productId: number) {
  const data = await db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      comment: reviews.comment,
      createdAt: reviews.created_at,
      productName: products.name,
      userName: users.username,
      profile: users.profile,
    })
    .from(reviews)
    .where(eq(reviews.product_id, productId))
    .innerJoin(products, eq(reviews.product_id, products.id))
    .innerJoin(users, eq(reviews.user_id, users.id))
    .orderBy(desc(reviews.created_at))
  
  return data
}
