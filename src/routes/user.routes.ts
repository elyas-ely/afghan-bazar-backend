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

const router = new Hono()

router.get('/', getUsers)
router.get('/:userId', getUserById)
router.get('/:userId/address', getUserAddress)
router.get('/:userId/address/:id', getUserAddressById)
router.delete('/:userId/address/:id', deleteUserAddressById)
router.post('/:userId/address', createUserAddress)
router.put('/:id/address', updateUserAddress)
router.post('/', createUser)

export default router
