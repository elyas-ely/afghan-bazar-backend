import { Hono } from 'hono'
import { getProductById, getProducts } from '../controllers/products.controller'

const router = new Hono()

router.get('/', getProducts)
router.get('/:id', getProductById)
// router.post('/', createUser)

export default router
