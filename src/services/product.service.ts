import { db } from '../config/database'
import { desc, eq } from 'drizzle-orm'
import { products } from '../schema/product.schema'
import { CreateProductInput } from '../types'

export async function getAllProducts() {
  const allProducts = await db
    .select()
    .from(products)
    .orderBy(desc(products.created_at))
    .limit(10)
  return allProducts
}

export async function getProductById(id: number) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
  return product[0]
}

export async function createNewProduct(data: CreateProductInput) {
  const newProduct = await db.insert(products).values(data).returning()
  return newProduct[0]
}
