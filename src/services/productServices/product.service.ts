import { db } from '../../config/database'
import { desc, eq, sql, and, ilike, SQL, asc } from 'drizzle-orm'

import {
  CreateProductInput,
  DbCreateProductInput,
  ProductFilters,
} from '../../types/product.types'
import { products } from '../../db/schema/products'
import { reviews } from '../../db/schema/reviews'
import { viewed_products } from '../../db/schema/viewedProducts'
import { saves } from '../../db/schema/saves'

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

//
//
//
//
//

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
