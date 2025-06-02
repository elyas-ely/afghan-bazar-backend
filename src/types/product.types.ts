import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { products, updateProductSchema } from '../schema/product.schema'
import { z } from 'zod'

// Product entity and input types
export type Product = InferSelectModel<typeof products>

// Define API-level types that use number for price
export type CreateProductInput = Omit<
  InferInsertModel<typeof products>,
  'price'
> & {
  price: number
  images: string[]
  category_id: number
  price_unit: string
  weights: string[]
  features: string[]
  origin: string
  popular: boolean
  rating: number
  instructions: string
}

export type UpdateProductInput = z.infer<typeof updateProductSchema>

// Database-specific types
export type DbCreateProductInput = {
  name: string
  description: string
  price: string // Price as string for DB
  images: string[]
  category_id: number
  price_unit: string
  weights: string[]
  features: string[]
  origin: string
  popular: boolean
  rating: number
  instructions: string
}

// DB update type with all fields optional
export type DbUpdateProductInput = {
  name?: string
  description?: string
  price?: string // Price as string for DB
  images?: string[]
  category_id?: number
  price_unit?: string
  weights?: string[]
  features?: string[]
  origin?: string
  popular?: boolean
  rating?: number
  instructions?: string
}

export type ProductFilters = {
  query: string
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  offset: number
  limit: number
}

// Product service interface
export interface ProductService {
  getAllProducts(): Promise<Product[]>
  getProductById(id: number): Promise<Product | null>
  createProduct(data: CreateProductInput): Promise<Product>
  updateProduct(id: number, data: UpdateProductInput): Promise<Product | null>
  deleteProduct(id: number): Promise<Product | null>
  getFilteredProducts(filters: ProductFilters): Promise<Product[]>
}
