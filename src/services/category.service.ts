import { desc, eq } from 'drizzle-orm'
import { db } from '../config/database'
import { products } from '../schema/product.schema'
// =========================
// ====== GET ADDRESS  =====
// =========================
export async function getAllProductsByCategory(categoryId: number) {
  const categories = await db
    .select()
    .from(products)
    .where(eq(products.category_id, categoryId))
    .orderBy(desc(products.created_at))
  return categories
}
