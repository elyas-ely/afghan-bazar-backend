import { Hono } from 'hono'
import {
  createProduct,
  getProductById,
  getProducts,
} from '../controllers/products.controller'

const router = new Hono()

router.get('/', getProducts)
router.get('/:id', getProductById)
router.post('/', createProduct)

export default router
