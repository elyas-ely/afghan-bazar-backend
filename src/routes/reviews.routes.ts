import { Hono } from 'hono'
import {
  getProductReview,
  getProductReviewById,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from '../controllers/reviews.controller'

const reviewRouter = new Hono()
reviewRouter.get('/', getProductReview)
reviewRouter.get('/:reviewId', getProductReviewById)
reviewRouter.post('/', createProductReview)
reviewRouter.patch('/:reviewId', updateProductReview)
reviewRouter.delete('/:reviewId', deleteProductReview)

export default reviewRouter
