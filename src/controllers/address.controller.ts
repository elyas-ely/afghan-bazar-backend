import { Context } from 'hono'
import {
  createUserAddressSchema,
  updateUserAddressSchema,
} from '../schema/address.schema'
import {
  getUserAddresses,
  getUserAddressById,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from '../services/address.service'

export async function getUserAddressesFn(c: Context) {
  const userId = c.req.param('userId')

  if (!userId) {
    return c.json(
      {
        success: 'false',
        message: 'User ID is required',
      },
      400
    )
  }

  try {
    const addresses = await getUserAddresses(userId)
    return c.json({
      success: 'true',
      addresses,
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getUserAddressByIdFn(c: Context) {
  const addressId = Number(c.req.param('addressId'))
  const userId = c.req.param('userId')

  if (!addressId || !userId) {
    return c.json(
      {
        success: 'false',
        message: 'Address ID or User ID is required',
      },
      400
    )
  }

  try {
    const address = await getUserAddressById(addressId, userId)

    if (!address) {
      return c.json(
        {
          success: 'false',
          message: 'Address not found',
        },
        404
      )
    }

    return c.json({
      success: 'true',
      address,
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function createUserAddressFn(c: Context) {
  const userId = c.req.param('userId') as string

  if (!userId) {
    return c.json({ error: 'User ID is required' }, 400)
  }

  try {
    const body = await c.req.json()
    console.log(userId)

    const validatedData = createUserAddressSchema.parse(body)

    const newAddress = await createUserAddress(validatedData)
    return c.json({ address: newAddress }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}

export async function updateUserAddressFn(c: Context) {
  const addressId = Number(c.req.param('addressId'))
  const userId = c.req.param('userId') as string

  if (!addressId || !userId) {
    return c.json({ error: 'Invalid address ID or user ID' }, 400)
  }

  console.log(userId)

  try {
    const body = await c.req.json()

    const validatedData = updateUserAddressSchema.parse(body)

    if (Object.keys(validatedData).length === 0) {
      return c.json({ error: 'No valid fields to update provided' }, 400)
    }
    const address = await updateUserAddress(addressId, userId, validatedData)

    if (!address) {
      return c.json({ error: 'Address not found or not authorized' }, 404)
    }

    return c.json({ address }, 200)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}

export async function deleteUserAddressFn(c: Context) {
  const userId = c.req.param('userId') as string
  const addressId = Number(c.req.param('addressId'))

  if (!addressId || !userId) {
    return c.json({ error: 'Invalid address ID or user ID' }, 400)
  }

  try {
    const address = await deleteUserAddress(addressId, userId)

    if (!address) {
      return c.json({ error: 'Address not found or not authorized' }, 404)
    }

    return c.json({ address }, 200)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}
