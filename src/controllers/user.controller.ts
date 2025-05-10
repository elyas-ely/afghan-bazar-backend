import { Context } from 'hono'
import { db } from '../config/database'
import {
  users,
  createUserSchema,
  type CreateUserInput,
} from '../schema/user.schema'
import { eq } from 'drizzle-orm'

export async function createUser(c: Context) {
  try {
    const body = await c.req.json()
    const validatedData = createUserSchema.parse(body)

    const newUser = await db.insert(users).values(validatedData).returning()

    return c.json({ user: newUser[0] }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}

export async function getUsers(c: Context) {
  try {
    const allUsers = await db.select().from(users).limit(10)
    return c.json(allUsers)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getUserById(c: Context) {
  const id = c.req.param('id') // ✅ treat as string

  if (!id || typeof id !== 'string') {
    return c.json({ error: 'Invalid user ID' }, 400)
  }

  try {
    const user = await db.select().from(users).where(eq(users.user_id, id))

    if (!user.length) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user: user[0] })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
