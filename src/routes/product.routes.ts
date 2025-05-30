import { Hono } from 'hono'
import {
  createProduct,
  deleteProductFn,
  getPopularProductsFn,
  getProductByIdFn,
  getRecommendedProducts,
  updateProductFn,
} from '../controllers/products.controller'
import reviewRouter from './reviews.routes'

const router = new Hono()

// Product routes
router.get('/', getRecommendedProducts)
router.get('/popular', getPopularProductsFn)
router.get('/:id', getProductByIdFn)
router.post('/', createProduct)
router.patch('/:id', updateProductFn)
router.delete('/:id', deleteProductFn)

// Review routes
router.route('/:id/reviews', reviewRouter)

export default router
