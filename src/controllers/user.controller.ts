import { Context } from 'hono'
import { db } from '../config/database'
import { and, eq } from 'drizzle-orm'
import {
  users,
  user_addresses,
  createUserSchema,
  createUserAddressSchema,
} from '../schema/user.schema'
//
//
//
// =====================
// ==== USER CONTROLLER ====
// =====================
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
  const userId = c.req.param('userId')

  if (!userId || typeof userId !== 'string') {
    return c.json({ error: 'Invalid user ID' }, 400)
  }

  try {
    const user = await db.select().from(users).where(eq(users.id, userId))

    if (!user.length) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user: user[0] })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
//
//
//
// ============================
// ==== USER ADDRESS CONTROLLER ====
// ============================
export async function getUserAddress(c: Context) {
  const userId = c.req.param('userId')

  if (!userId || typeof userId !== 'string') {
    return c.json({ error: 'Invalid user ID' }, 400)
  }

  try {
    const address = await db
      .select()
      .from(user_addresses)
      .where(eq(user_addresses.user_id, userId))

    return c.json(address)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getUserAddressById(c: Context) {
  const addressId = Number(c.req.param('id'))
  const userId = c.req.param('userId')

  if (
    !addressId ||
    !userId ||
    typeof addressId !== 'number' ||
    typeof userId !== 'string'
  ) {
    return c.json({ error: 'Invalid  address ID' }, 400)
  }
  try {
    const address = await db
      .select()
      .from(user_addresses)
      .where(eq(user_addresses.id, addressId))

    if (!address) {
      return c.json({ error: 'User address not found' }, 404)
    }

    return c.json(address)
  } catch (error) {
    console.log(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}

export async function createUserAddress(c: Context) {
  const userId = c.req.param('userId')

  if (!userId || typeof userId !== 'string') {
    return c.json({ error: 'Invalid user ID' }, 400)
  }

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

export async function updateUserAddress(c: Context) {
  try {
    const body = await c.req.json()
    const validatedData = createUserAddressSchema.parse(body)

    const address = await db
      .update(user_addresses)
      .set(validatedData)
      .where(
        and(
          eq(user_addresses.id, Number(addressId)),
          eq(user_addresses.user_id, userId)
        )
      )
      .returning()

    if (!address.length) {
      return c.json({ error: 'Address not found or not authorized' }, 404)
    }

    return c.json({ address: address[0] }, 200)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}

export async function deleteUserAddressById(c: Context) {
  const userId = c.req.param('userId')
  const addressId = Number(c.req.param('id'))

  if (
    !addressId ||
    !userId ||
    typeof addressId !== 'number' ||
    typeof userId !== 'string'
  ) {
    return c.json({ error: 'Invalid  address ID' }, 400)
  }
  try {
    const address = await db
      .delete(user_addresses)
      .where(
        and(
          eq(user_addresses.id, addressId),
          eq(user_addresses.user_id, userId)
        )
      )
      .returning()

    if (!address.length) {
      return c.json({ error: 'Address not found or not authorized' }, 404)
    }

    return c.json({ address: address[0] }, 200)
  } catch (error) {
    console.log(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}
