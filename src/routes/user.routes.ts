import { Hono } from 'hono'
import {
  createUser,
  getUsers,
  getUserById,
  getUserAddress,
  createUserAddress,
  updateUserAddress,
  getUserAddressById,
  deleteUserAddressById,
} from '../controllers/user.controller'
import { errorHandler } from '../middleware/error.middleware'

const router = new Hono()

// Apply error handling middleware
router.use('*', errorHandler)

// User routes
router.get('/', getUsers)
router.post('/', createUser)
router.get('/:userId', getUserById)

// User address routes
const addressRouter = new Hono()
addressRouter.get('/', getUserAddress)
addressRouter.post('/', createUserAddress)
addressRouter.get('/:addressId', getUserAddressById)
addressRouter.delete('/:addressId', deleteUserAddressById)
addressRouter.put('/:addressId', updateUserAddress)

// Mount address routes under user routes
router.route('/:userId/addresses', addressRouter)

export default router
