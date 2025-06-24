import { and, eq, sql } from 'drizzle-orm'
import { saves } from '../../db/schema/saves'
import { db } from '../../config/database'
import { products } from '../../db/schema/products'
import { reviews } from '../../db/schema/reviews'

export async function getUserWishlist(
  offset: number,
  limit: number,
  userId: string
) {
  const savedProducts = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      price_unit: products.price_unit,
      images: products.images,
      weights: products.weights,
      features: products.features,
      origin: products.origin,
      popular: products.popular,
      instructions: products.instructions,
      rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
      is_saved: sql<boolean>`EXISTS (SELECT 1 FROM ${saves} WHERE ${saves.product_id} = ${products.id} AND ${saves.user_id} = ${userId})`,
    })
    .from(saves)
    .innerJoin(products, eq(saves.product_id, products.id))
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .where(eq(saves.user_id, userId))
    .groupBy(products.id)
    .limit(limit + 1) // Fetch one extra item
    .offset(offset)

  const hasNextPage = savedProducts.length > limit
  if (hasNextPage) {
    savedProducts.pop() // Remove the extra item
  }

  return { items: savedProducts, hasNextPage }
}
export async function addToWishlist(userId: string, productId: number) {
  const condition = and(
    eq(saves.product_id, productId),
    eq(saves.user_id, userId)
  )

  const existing = await db
    .select()
    .from(saves)
    .where(condition)
    .limit(1)
    .execute()

  if (existing.length > 0) {
    await db.delete(saves).where(condition).execute()

    return { status: 'removed' }
  }

  const [saved] = await db
    .insert(saves)
    .values({ product_id: productId, user_id: userId })
    .returning()

  return { status: 'added', saved }
}
