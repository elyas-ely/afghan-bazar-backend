import { Hono } from 'hono'
import {
  createUser,
  getUsers,
  getUserById,
} from '../controllers/user.controller'

const router = new Hono()

router.get('/', getUsers)
// router.post('/', createUser);
// router.get('/:id', getUserById);

export default router
