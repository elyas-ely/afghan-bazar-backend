import { Hono } from 'hono'
import {
  getProductReview,
  getProductReviewById,
} from '../controllers/reviews.controller'

const reviewRouter = new Hono()
reviewRouter.get('/', getProductReview)
reviewRouter.get('/:reviewId', getProductReviewById)
// reviewRouter.get('/:addressId', getUserAddressById)
// reviewRouter.delete('/:addressId', deleteUserAddressById)
// reviewRouter.put('/:addressId', updateUserAddress)

export default reviewRouter
