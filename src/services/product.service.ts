import { db } from '../config/database'
import { desc, eq, sql, and, ilike, SQL } from 'drizzle-orm'
import { products } from '../schema/product.schema'
import {
  UpdateProductInput,
  CreateProductInput,
  DbCreateProductInput,
  DbUpdateProductInput,
  ProductFilters,
} from '../types/product.types'
import { reviews } from '../schema/review.schema'

export async function getRecommendedProducts(categoryId: number) {
  const query = db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      price_unit: products.price_unit,
      images: products.images,
      popular: products.popular,
      weights: products.weights,
      features: products.features,
      origin: products.origin,
      instructions: products.instructions,
      rating: sql<number>`COALESCE(ROUND(AVG(${reviews.rating})::numeric, 1), 0)`,
    })
    .from(products)
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))

  // Only apply the category filter if categoryId is not 0
  if (categoryId !== 0) {
    query.where(eq(products.category_id, categoryId))
  }

  const allProducts = await query
  return allProducts
}

export async function getPopularProducts(categoryId: number) {
  const baseQuery = db
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
    .from(products)
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))

  // Build conditional where clause
  if (categoryId !== 0) {
    baseQuery.where(
      and(eq(products.category_id, categoryId), eq(products.popular, true))
    )
  } else {
    baseQuery.where(eq(products.popular, true))
  }

  const allProducts = await baseQuery
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

export async function getSearchProducts(query: string) {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
    })
    .from(products)
    .where(ilike(products.name, `${query}%`))
    .groupBy(products.id)
    .orderBy(desc(products.name))

  return allProducts
}

export async function getFilteredProducts(filters: ProductFilters) {
  const { query, categoryId, minPrice, maxPrice } = filters

  // Create base query
  let queryBuilder = db
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
    .from(products)
    .leftJoin(reviews, eq(reviews.product_id, products.id))

  // Build SQL conditions
  const conditions: SQL<unknown>[] = []

  // Add conditions only if they are valid
  if (query && String(query).trim() !== '') {
    conditions.push(ilike(products.name, `${String(query).trim()}%`))
  }
  
  if (categoryId && !isNaN(categoryId) && categoryId > 0) {
    conditions.push(eq(products.category_id, categoryId))
  }

  if (minPrice !== undefined && !isNaN(minPrice) && minPrice > 0) {
    conditions.push(sql<boolean>`CAST(${products.price} AS NUMERIC) >= ${minPrice}`)
  }
  
  if (maxPrice !== undefined && !isNaN(maxPrice) && maxPrice > 0) {
    conditions.push(sql<boolean>`CAST(${products.price} AS NUMERIC) <= ${maxPrice}`)
  }

  // Apply the WHERE clause only if we have conditions
  if (conditions.length > 0) {
    // Following the fix from our memory - use type assertion for SQL conditions
    if (conditions.length === 1) {
      // If only one condition, no need to combine
      queryBuilder = (queryBuilder as any).where(conditions[0])
    } else {
      // Combine multiple conditions
      let combinedCondition = conditions[0]
      for (let i = 1; i < conditions.length; i++) {
        combinedCondition = and(combinedCondition, conditions[i])
      }
      queryBuilder = (queryBuilder as any).where(combinedCondition)
    }
  }

  // Execute the query with group by and order by
  const results = await queryBuilder
    .groupBy(products.id)
    .orderBy(desc(products.created_at))

  return results
}

export async function createNewProduct(data: CreateProductInput) {
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
    popular: data.popular,
    rating: data.rating,
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
