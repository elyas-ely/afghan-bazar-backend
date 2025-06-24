import { and, desc, eq, sql } from 'drizzle-orm'
import { db } from '../../config/database'
import { products } from '../../db/schema/products'
import { reviews } from '../../db/schema/reviews'
import { viewed_products } from '../../db/schema/viewedProducts'

export async function getViewedProducts(userId: string) {
  const viewedProducts = await db
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
    })
    .from(viewed_products)
    .innerJoin(products, eq(viewed_products.product_id, products.id))
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .where(eq(viewed_products.user_id, userId))
    .groupBy(products.id, viewed_products.updated_at)
    .orderBy(desc(viewed_products.updated_at))

  return viewedProducts
}

export async function updateViewedProduct(productId: number, userId: string) {
  const condition = and(
    eq(viewed_products.product_id, productId),
    eq(viewed_products.user_id, userId)
  )

  const existing = await db
    .select()
    .from(viewed_products)
    .where(condition)
    .limit(1)
    .execute()

  if (existing.length > 0) {
    await db
      .update(viewed_products)
      .set({ updated_at: sql`CURRENT_TIMESTAMP` })
      .where(condition)
      .execute()

    return { status: 'updated' }
  }

  // Get all viewed products for the user (sorted by oldest first)
  const viewed = await db
    .select()
    .from(viewed_products)
    .where(eq(viewed_products.user_id, userId))
    .orderBy(viewed_products.updated_at)
    .execute()

  // If the user has 5 already, delete the oldest one
  if (viewed.length >= 5) {
    const oldest = viewed[0]
    await db
      .delete(viewed_products)
      .where(
        and(
          eq(viewed_products.user_id, userId),
          eq(viewed_products.product_id, oldest.product_id)
        )
      )
      .execute()
  }

  // Insert the new viewed product
  const [inserted] = await db
    .insert(viewed_products)
    .values({
      product_id: productId,
      user_id: userId,
    })
    .returning()

  return { status: 'inserted', inserted }
}
