import { Hono } from 'hono'
import {
  createProduct,
  deleteProductFn,
  getFilteredProductsFn,
  getPopularProductsFn,
  getProductByIdFn,
  getRecommendedProductsFn,
  getSearchProductsFn,
  updateProductFn,
  getViewedProductsFn,
  updateViewedProductFn,
} from '../controllers/products.controller'
import reviewRouter from './reviews.routes'

const router = new Hono()

// Product routes
router.get('/', getRecommendedProductsFn)
router.get('/popular', getPopularProductsFn)
router.get('/search', getSearchProductsFn)
router.get('/filtered', getFilteredProductsFn)
router.get('/viewed', getViewedProductsFn)
router.put('/viewed/:pId', updateViewedProductFn)
router.get('/:pId', getProductByIdFn)

router.post('/', createProduct)
router.patch('/:pId', updateProductFn)
router.delete('/:pId', deleteProductFn)

// Review routes
router.route('/:pId/reviews', reviewRouter)

export default router
