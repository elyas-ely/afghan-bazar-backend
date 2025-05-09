import { Hono } from 'hono';
import { createUser, getUsers, getUserById } from '../controllers/user.controller';

const router = new Hono();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;
