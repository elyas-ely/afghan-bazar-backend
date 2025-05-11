import { Hono } from 'hono'
import {
  createProduct,
  getProductById,
  getProducts,
} from '../controllers/products.controller'
import reviewRouter from './reviews.routes'

const router = new Hono()

// Product routes
router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', createProduct)

// Review routes
router.route('/:id/reviews', reviewRouter)

export default router
