import { Hono } from 'hono'
import {
  createUser,
  getUsers,
  getUserById,
} from '../controllers/user.controller'

const router = new Hono()

router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', createUser)

export default router
