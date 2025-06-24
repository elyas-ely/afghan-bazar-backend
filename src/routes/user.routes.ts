import { Hono } from 'hono'
import {
  createUserFn,
  getAllUsersFn,
  getUserByIdFn,
  updateUserFn,
  deleteUserFn,
} from '../controllers/userControllers/user.controller'
import { errorHandler } from '../middleware/error.middleware'
import addressRouter from './userRoutes/address.routes'
import ordersRouter from './userRoutes/orders.routes'
import wishlistRouter from './userRoutes/wishlist.router'

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

export default router
