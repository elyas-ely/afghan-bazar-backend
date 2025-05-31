import { Hono } from 'hono'
import {
  createProduct,
  deleteProductFn,
  getPopularProductsFn,
  getProductByIdFn,
  getRecommendedProductsFn,
  getSearchProductsFn,
  updateProductFn,
} from '../controllers/products.controller'
import reviewRouter from './reviews.routes'

const router = new Hono()

// Product routes
router.get('/', getRecommendedProductsFn)
router.get('/popular', getPopularProductsFn)
router.get('/search', getSearchProductsFn)
router.get('/:id', getProductByIdFn)
router.post('/', createProduct)
router.patch('/:id', updateProductFn)
router.delete('/:id', deleteProductFn)

// Review routes
router.route('/:id/reviews', reviewRouter)

export default router
