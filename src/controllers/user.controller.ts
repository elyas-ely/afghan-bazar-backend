import { Context } from 'hono'
import { createUserSchema } from '../schema/user.schema'

import {
  getAllUsers,
  getUserById,
  createNewUser,
} from '../services/user.service'

export async function getAllUsersFn(c: Context) {
  try {
    const allUsers = await getAllUsers()
    return c.json(allUsers)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getUserByIdFn(c: Context) {
  const userId = c.req.param('userId')

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const user = await getUserById(userId)

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json(user)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function createUserFn(c: Context) {
  const body = await c.req.json()

  if (!body?.id) {
    return c.json({ error: 'User id is required' }, 400)
  }

  try {
    const validatedData = createUserSchema.parse(body)
    const newUser = await createNewUser(validatedData)
    return c.json({ user: newUser }, 201)
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return c.json({ error: error.errors }, 400)
    }

    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
