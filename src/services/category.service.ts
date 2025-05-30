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
      tags: products.tags,
      weight: products.weight,
      packaging: products.packaging,
      ingredients: products.ingredients,
      createdAt: products.created_at,
      rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
      totalReviews: sql<number>`COUNT(${reviews.id})`,
    })
    .from(products)
    .where(eq(products.category_id, categoryId))
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))

  return categories
}
