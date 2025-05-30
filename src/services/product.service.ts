import { db } from '../config/database'
import { desc, eq, sql, and } from 'drizzle-orm'
import { products } from '../schema/product.schema'
import {
  UpdateProductInput,
  CreateProductInput,
  DbCreateProductInput,
  DbUpdateProductInput,
} from '../types/product.types'
import { reviews } from '../schema/review.schema'

export async function getAllProducts(categoryId: number) {
  const allProducts = await db
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
      instructions: products.instructions,
      rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
    })
    .from(products)
    .where(eq(products.category_id, categoryId))
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))

  return allProducts
}

export async function getPopularProducts(categoryId: number) {
  const allProducts = await db
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
      instructions: products.instructions,
      rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
    })
    .from(products)
    .where(
      and(eq(products.category_id, categoryId), eq(products.popular, true))
    )
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))

  return allProducts
}

export async function getProductById(id: number) {
  const product = await db
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
      instructions: products.instructions,
      rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
    })
    .from(products)
    .where(eq(products.id, id))
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))
  return product[0]
}

export async function createNewProduct(data: CreateProductInput) {
  // Create a proper DB-compatible object
  const dbData: DbCreateProductInput = {
    name: data.name,
    description: data.description,
    price: data.price.toString(),
    images: data.images,
    category_id: data.category_id,
    price_unit: data.price_unit,
    weights: data.weights,
    features: data.features,
    origin: data.origin,
    instructions: data.instructions,
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
  if (data.weights !== undefined) dbData.weights = data.weights
  if (data.features !== undefined) dbData.features = data.features
  if (data.origin !== undefined) dbData.origin = data.origin
  if (data.instructions !== undefined) dbData.instructions = data.instructions

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
