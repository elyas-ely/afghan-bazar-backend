import { Hono } from 'hono'
import {
  createUser,
  getUsers,
  getUserById,
} from '../controllers/user.controller'
import { errorHandler } from '../middleware/error.middleware'
import addressRouter from './address.routes'

const router = new Hono()

// Apply error handling middleware
router.use('*', errorHandler)

// User routes
router.get('/', getUsers)
router.post('/', createUser)
router.get('/:userId', getUserById)

// Mount address routes under user routes
router.route('/:userId/addresses', addressRouter)

export default router
