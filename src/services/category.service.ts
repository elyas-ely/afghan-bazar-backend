import { desc, eq, sql } from 'drizzle-orm'
import { db } from '../config/database'
import { products } from '../schema/product.schema'
import { reviews } from '../schema/review.schema'
// =========================
// ====== GET ADDRESS  =====
// =========================
export async function getAllProductsByCategory(categoryId: number) {
  const categories = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      images: products.images,
      weights: products.weights,
      features: products.features,
      origin: products.origin,
      instructions: products.instructions,
      rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
    })
    .from(products)
    .where(eq(products.category_id, categoryId))
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))

  return categories
}
