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
  // 1. UPSERT: Insert or update updated_at timestamp if exists
  await db
    .insert(viewed_products)
    .values({
      product_id: productId,
      user_id: userId,
    })
    .onConflictDoUpdate({
      target: [viewed_products.product_id, viewed_products.user_id],
      set: {
        updated_at: sql`CURRENT_TIMESTAMP`,
      },
    })
    .execute();

  // 2. Delete viewed products exceeding 5 most recent per user
  await db
    .delete(viewed_products)
    .where(
      and(
        eq(viewed_products.user_id, userId),
        sql`product_id NOT IN (
          SELECT product_id FROM viewed_products
          WHERE user_id = ${userId}
          ORDER BY updated_at DESC
          LIMIT 5
        )`
      )
    )
    .execute();

  return { status: 'success' };
}

