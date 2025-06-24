import { Hono } from 'hono'
import {
  getFilteredProductsFn,
  getPopularProductsFn,
  getProductByIdFn,
  getRecommendedProductsFn,
  getSearchProductsFn,
} from '../../controllers/productControllers/products.controller'
import reviewRouter from './reviews.routes'

const router = new Hono()

// Product routes
router.get('/', getRecommendedProductsFn)
router.get('/popular', getPopularProductsFn)
router.get('/search', getSearchProductsFn)
router.get('/filtered', getFilteredProductsFn)
router.get('/:pId', getProductByIdFn)

// Review routes
router.route('/:pId/reviews', reviewRouter)

export default router
