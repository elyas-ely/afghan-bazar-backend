import { db } from '../config/database'
import { desc, eq, sql } from 'drizzle-orm'
import { products } from '../schema/product.schema'
import {
  UpdateProductInput,
  CreateProductInput,
  DbCreateProductInput,
  DbUpdateProductInput,
} from '../types/product.types'
import { reviews } from '../schema/review.schema'

export async function getAllProducts() {
  const allProducts = await db
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
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))
    .limit(10)

  return allProducts
}

export async function getProductById(id: number) {
  const product = await db.select().from(products).where(eq(products.id, id))
  return product[0]
}

export async function createNewProduct(data: CreateProductInput) {
  // Create a proper DB-compatible object
  const dbData: DbCreateProductInput = {
    name: data.name,
    description: data.description,
    price: data.price.toString(), // Convert price to string
    images: data.images,
    category_id: data.category_id,
    weight: data.weight,
    packaging: data.packaging,
    tags: data.tags || null,
    ingredients: data.ingredients || null,
  }

  const newProduct = await db.insert(products).values(dbData).returning()
  return newProduct[0]
}

/**
 * Update a product by ID with partial data
 */
export async function updateProduct(
  productId: number,
  data: UpdateProductInput
) {
  // Check if there are fields to update
  if (Object.keys(data).length === 0) {
    return getProductById(productId)
  }

  // Create a proper DB-compatible update object
  const dbData: DbUpdateProductInput = {}

  // Only copy over fields that are defined
  if (data.name !== undefined) dbData.name = data.name
  if (data.description !== undefined) dbData.description = data.description
  if (data.price !== undefined) dbData.price = data.price.toString()
  if (data.images !== undefined) dbData.images = data.images
  if (data.category_id !== undefined) dbData.category_id = data.category_id
  if (data.weight !== undefined) dbData.weight = data.weight
  if (data.packaging !== undefined) dbData.packaging = data.packaging
  if (data.tags !== undefined) dbData.tags = data.tags
  if (data.ingredients !== undefined) dbData.ingredients = data.ingredients

  const updatedProduct = await db
    .update(products)
    .set(dbData)
    .where(eq(products.id, productId))
    .returning()

  return updatedProduct[0]
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(productId: number) {
  const deletedProduct = await db
    .delete(products)
    .where(eq(products.id, productId))
    .returning()

  return deletedProduct[0]
}
