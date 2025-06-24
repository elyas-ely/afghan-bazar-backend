import { db } from '../config/database'
import { desc, eq, sql, and, ilike, SQL, asc } from 'drizzle-orm'

import {
  UpdateProductInput,
  CreateProductInput,
  DbCreateProductInput,
  DbUpdateProductInput,
  ProductFilters,
} from '../types/product.types'
import { products } from '../db/schema/products'
import { reviews } from '../db/schema/reviews'
import { viewed_products } from '../db/schema/viewedProducts'
import { saves } from '../db/schema/saves'

export async function getRecommendedProducts(
  categoryId: number,
  offset: number,
  limit: number,
  userId: string
) {
  // Build conditions array for both queries
  const conditions: SQL<unknown>[] = []

  if (categoryId !== 0) {
    conditions.push(eq(products.category_id, categoryId))
  }

  // Get total count first
  const countQuery = db
    .select({ count: sql<number>`COUNT(DISTINCT ${products.id})` })
    .from(products)

  if (conditions.length > 0) {
    countQuery.where(and(...conditions) as any)
  }

  const totalCount = await countQuery.execute()
  const total = totalCount[0]?.count || 0

  // Get paginated results
  const query = db
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
      created_at: products.created_at,
      updated_at: products.updated_at,
    })
    .from(products)
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .leftJoin(saves, eq(saves.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(products.created_at))
    .limit(limit)
    .offset(offset)

  if (conditions.length > 0) {
    query.where(and(...conditions) as any)
  }

  const result = await query.execute()
  // Check if there are more items available after the current page
  const hasNextPage = offset + limit < total

  return {
    items: result,
    hasNextPage,
  }
}

export async function getPopularProducts(
  categoryId: number,
  limit: number,
  userId: string
) {
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
      is_saved: sql<boolean>`EXISTS (SELECT 1 FROM ${saves} WHERE ${saves.product_id} = ${products.id} AND ${saves.user_id} = ${userId})`,
      created_at: products.created_at,
      updated_at: products.updated_at,
    })
    .from(products)
    .leftJoin(reviews, eq(reviews.product_id, products.id))
    .leftJoin(saves, eq(saves.product_id, products.id))
    .groupBy(products.id)
    .orderBy(desc(sql`MAX(${products.created_at})`))
    .limit(limit)

  if (categoryId !== 0) {
    baseQuery.where(
      and(eq(products.category_id, categoryId), eq(products.popular, true))
    )
  } else {
    baseQuery.where(eq(products.popular, true))
  }

  const allProducts = await baseQuery.execute()
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

export async function getSearchProducts(query: string, limit: number) {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
    })
    .from(products)
    .where(ilike(products.name, `${query}%`))
    .groupBy(products.id)
    .orderBy(asc(products.name))
    .limit(limit)

  return allProducts
}

export async function getFilteredProducts(filters: ProductFilters) {
  const {
    query: searchQuery,
    categoryId,
    minPrice,
    maxPrice,
    offset,
    limit,
  } = filters

  const conditions: SQL<unknown>[] = []

  // Only add name condition if searchQuery is provided
  if (searchQuery && searchQuery.trim() !== '') {
    conditions.push(ilike(products.name, `${searchQuery}%`))
  }

  if (categoryId !== undefined && categoryId !== 0) {
    conditions.push(eq(products.category_id, categoryId))
  }

  if (minPrice !== undefined) {
    conditions.push(
      sql<boolean>`CAST(${products.price} AS NUMERIC) >= ${minPrice}`
    )
  }

  if (maxPrice !== undefined) {
    conditions.push(
      sql<boolean>`CAST(${products.price} AS NUMERIC) <= ${maxPrice}`
    )
  }

  // Get total count first
  const countQuery = db
    .select({ count: sql<number>`COUNT(DISTINCT ${products.id})` })
    .from(products)

  if (conditions.length > 0) {
    countQuery.where(and(...conditions) as any)
  }

  const totalCount = await countQuery.execute()
  const total = totalCount[0]?.count || 0

  // Build the main query
  const query = db
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
    .orderBy(asc(products.name), desc(products.created_at))
    .limit(limit)
    .offset(offset)

  // Handle conditions with type assertion to satisfy TypeScript
  if (conditions.length > 0) {
    // Use the 'as any' workaround when calling the where method
    ;(query as any).where(and(...conditions))
  }

  const results = await query.execute()

  // Check if there are more items available after the current page
  const hasNextPage = offset + limit < total

  return {
    items: results,
    hasNextPage,
  }
}

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
    .groupBy(products.id, viewed_products.created_at)
    .orderBy(desc(viewed_products.created_at))

  return viewedProducts
}

//
//
//
//
//

export async function updateViewedProduct(productId: number, userId: string) {
  const updatedProduct = await db
    .insert(viewed_products)
    .values({
      product_id: productId,
      user_id: userId,
    })
    .returning()

  return updatedProduct[0]
}

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
