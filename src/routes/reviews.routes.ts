import { Hono } from 'hono'
import {
  getProductReview,
  getProductReviewById,
  createProductReview,
  updateProductReview,
  deleteProductReview,
} from '../controllers/reviews.controller'
import {
  createProductReviewFn,
  getProductReviewFn,
  getReviewsCountByRatingFn,
} from '../controllers/review.controller'

const reviewRouter = new Hono()
reviewRouter.get('/', getProductReviewFn)
reviewRouter.get('/count', getReviewsCountByRatingFn)
reviewRouter.get('/:reviewId', getProductReviewById)
reviewRouter.post('/', createProductReviewFn)
reviewRouter.patch('/:reviewId', updateProductReview)
reviewRouter.delete('/:reviewId', deleteProductReview)

export default reviewRouter
