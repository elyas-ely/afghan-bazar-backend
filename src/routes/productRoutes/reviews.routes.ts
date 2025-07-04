import { Hono } from 'hono'
import {
  getProductReviewFn,
  getProductReviewByIdFn,
  createProductReviewFn,
  updateProductReviewFn,
  deleteProductReviewFn,
  getReviewsCountByRatingFn,
  getProductMiniReviewsFn,
} from '../../controllers/productControllers/reviews.controller'

const reviewRouter = new Hono()
reviewRouter.get('/', getProductReviewFn)
reviewRouter.get('/count', getReviewsCountByRatingFn)
reviewRouter.get('/mini', getProductMiniReviewsFn)
reviewRouter.get('/:rId', getProductReviewByIdFn)
reviewRouter.post('/', createProductReviewFn)
reviewRouter.patch('/:rId', updateProductReviewFn)
reviewRouter.delete('/:rId', deleteProductReviewFn)

export default reviewRouter
