import { Context } from 'hono'
import { createUserSchema, updateUserSchema } from '../schema/user.schema'

import {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUser,
  deleteUser,
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

export async function updateUserFn(c: Context) {
  const userId = c.req.param('userId')

  if (!userId) {
    return c.json({ success: 'false', message: 'User ID is required' }, 400)
  }

  try {
    const body = await c.req.json()
    const validatedData = updateUserSchema.parse(body)

    if (Object.keys(validatedData).length === 0) {
      return c.json(
        { success: 'false', message: 'No valid fields to update provided' },
        400
      )
    }

    const updatedUser = await updateUser(userId, validatedData)

    return c.json({ user: updatedUser })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ success: 'false', error: error.errors }, 400)
    }

    console.error(error)
    return c.json({ success: 'false', error: 'Internal Server Error' }, 500)
  }
}

export async function deleteUserFn(c: Context) {
  const userId = c.req.param('userId')

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const deletedUser = await deleteUser(userId)

    if (!deletedUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      message: 'User deleted successfully',
      user: deletedUser,
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
