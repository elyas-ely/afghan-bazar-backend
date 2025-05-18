import { Hono } from 'hono'
import {
  createProduct,
  deleteProductFn,
  getProductByIdFn,
  getProducts,
  updateProductFn,
} from '../controllers/products.controller'
import reviewRouter from './reviews.routes'
import categoryRouter from './category.routes'

const router = new Hono()

// Product routes
router.get('/', getProducts)
router.route('/categories', categoryRouter)
router.get('/:id', getProductByIdFn)
router.post('/', createProduct)
router.patch('/:id', updateProductFn)
router.delete('/:id', deleteProductFn)

// Review routes
router.route('/:id/reviews', reviewRouter)

export default router
