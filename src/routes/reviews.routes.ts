import { Hono } from 'hono'
import {
  getProductReview,
  getProductReviewById,
} from '../controllers/reviews.controller'

const reviewRouter = new Hono()
reviewRouter.get('/', getProductReview)
reviewRouter.get('/:reviewId', getProductReviewById)

export default reviewRouter
