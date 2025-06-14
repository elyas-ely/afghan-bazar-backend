import { z } from 'zod'

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1),
  category_id: z.number().int().positive(),
  price_unit: z.string().min(1).max(50),
  weights: z.array(z.string().min(1).max(10)),
  features: z.array(z.string()),
  origin: z.string().min(1).max(100),
  instructions: z.string(),
})

// Update schema with all fields optional for partial updates
export const updateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(), // Keep as number for validation
  images: z.array(z.string().url()).min(1).optional(),
  category_id: z.number().int().positive().optional(),
  price_unit: z.string().min(1).max(50).optional(),
  weights: z.array(z.string().min(1).max(10)).optional(),
  features: z.array(z.string()).optional(),
  origin: z.string().min(1).max(100).optional(),
  instructions: z.string().optional(),
})
