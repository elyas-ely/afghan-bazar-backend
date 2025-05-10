import { Context } from 'hono'
import { db } from '../config/database'
import { eq } from 'drizzle-orm'
import {
  users,
  user_addresses,
  createUserSchema,
  type CreateUserInput,
  createUserAddressSchema,
} from '../schema/user.schema'

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
    const allUsers = await db
      .select()
      .from(users)
      .limit(10)
      .orderBy(users.created_at)
    return c.json(allUsers)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getUserById(c: Context) {
  const id = c.req.param('id')

  if (!id || typeof id !== 'string') {
    return c.json({ error: 'Invalid user ID' }, 400)
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, id))

    if (!user.length) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user: user[0] })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getUserAddress(c: Context) {
  const id = c.req.param('id')

  if (!id || typeof id !== 'string') {
    return c.json({ error: 'Invalid user ID' }, 400)
  }

  try {
    const address = await db
      .select()
      .from(user_addresses)
      .where(eq(user_addresses.user_id, id))

    if (!address.length) {
      return c.json({ error: 'User address not found' }, 404)
    }

    return c.json(address)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function createUserAddress(c: Context) {
  try {
    const body = await c.req.json()
    const validatedData = createUserAddressSchema.parse(body)

    const newAddress = await db
      .insert(user_addresses)
      .values(validatedData)
      .returning()

    return c.json({ address: newAddress[0] }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}
