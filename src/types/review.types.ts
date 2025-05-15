import { z } from 'zod'
import { Review } from '../schema/review.schema'

// Basic review data without relations
export interface ReviewData {
  id: number
  product_id: number
  user_id: string
  rating: string | number
  comment: string
  created_at: Date
  updated_at: Date
}

// Review with user information included
export interface ReviewWithUser {
  id: number
  rating: string | number
  userName: string
  profile: string | null
  comment: string
  createdAt: Date
}

// Request body for creating a new review
export interface CreateReviewRequest {
  user_id: string
  rating: number
  comment: string
}

// Request body for updating an existing review
export interface UpdateReviewRequest {
  rating?: number
  comment?: string
  user_id?: string // For verification purposes
}

// Parameters for review filtering
export interface ReviewFilterParams {
  productId: number
  userId?: string
  limit?: number
  offset?: number
  sortBy?: 'rating' | 'created_at'
  sortOrder?: 'asc' | 'desc' 
}

// Response for review operations
export interface ReviewResponse {
  message: string
  review?: Review | ReviewWithUser
  reviews?: ReviewWithUser[]
  total?: number
}
