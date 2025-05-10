import { Hono } from 'hono'
import {
  createUser,
  getUsers,
  getUserById,
  getUserAddress,
  createUserAddress,
} from '../controllers/user.controller'

const router = new Hono()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.get('/:id/address', getUserAddress)
router.post('/:id/address', createUserAddress)
router.post('/', createUser)

export default router
