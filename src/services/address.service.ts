import { db } from '../config/database'
import { and, eq } from 'drizzle-orm'
import { user_addresses } from '../schema/user.schema'
import { CreateAddressInput } from '../types'

export async function getUserAddresses(userId: string) {
  const addresses = await db
    .select()
    .from(user_addresses)
    .where(eq(user_addresses.user_id, userId))
  return addresses
}

export async function getUserAddressById(addressId: number, userId: string) {
  const address = await db
    .select()
    .from(user_addresses)
    .where(eq(user_addresses.id, addressId))
  return address[0]
}

export async function createUserAddress(data: CreateAddressInput) {
  const newAddress = await db
    .insert(user_addresses)
    .values(data)
    .returning()
  return newAddress[0]
}

export async function updateUserAddress(addressId: number, userId: string, data: CreateAddressInput) {
  const address = await db
    .update(user_addresses)
    .set(data)
    .where(
      and(
        eq(user_addresses.id, addressId),
        eq(user_addresses.user_id, userId)
      )
    )
    .returning()
  return address[0]
}

export async function deleteUserAddress(addressId: number, userId: string) {
  const address = await db
    .delete(user_addresses)
    .where(
      and(
        eq(user_addresses.id, addressId),
        eq(user_addresses.user_id, userId)
      )
    )
    .returning()
  return address[0]
}
