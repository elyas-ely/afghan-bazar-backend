import { Hono } from 'hono'
import {
  createUserFn,
  getAllUsersFn,
  getUserByIdFn,
  updateUserFn,
  deleteUserFn,
} from '../../controllers/userControllers/user.controller'
import { errorHandler } from '../../middleware/error.middleware'
import addressRouter from './address.routes'
import ordersRouter from './orders.routes'
import wishlistRouter from './wishlist.router'
import viewedProductsRouter from './viewed.routes'

const router = new Hono()

// Apply error handling middleware
router.use('*', errorHandler)

// User routes
router.get('/', getAllUsersFn)
router.get('/:userId', getUserByIdFn)
router.post('/', createUserFn)
router.patch('/:userId', updateUserFn)
router.delete('/:userId', deleteUserFn)

// Mount address routes under user routes
router.route('/:userId/addresses', addressRouter)
router.route('/:userId/orders', ordersRouter)
router.route('/:userId/saves', wishlistRouter)
router.route('/:userId/viewed', viewedProductsRouter)

export default router
