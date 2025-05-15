import { db } from '../config/database'
import { and, desc, eq } from 'drizzle-orm'
import { user_addresses } from '../schema/address.schema'
import { CreateUserAddressInput, UpdateUserAddressInput } from '../types/address.types'


// =========================
// ====== GET ADDRESS  =====
// =========================
export async function getUserAddresses(userId: string) {
  const addresses = await db
    .select()
    .from(user_addresses)
    .where(eq(user_addresses.user_id, userId))
    .orderBy(desc(user_addresses.created_at))
  return addresses
}

export async function getUserAddressById(addressId: number, userId: string) {
  const address = await db
    .select()
    .from(user_addresses)
    .where(
      and(eq(user_addresses.id, addressId), eq(user_addresses.user_id, userId))
    )
  return address[0]
}
//
//
//
//
//
// =========================
// ====== POST ADDRESS  ====
// =========================
export async function createUserAddress(data: CreateUserAddressInput) {
  const newAddress = await db.insert(user_addresses).values(data).returning()
  return newAddress[0]
}
//
//
//
//
//
// =========================
// ====== PUT ADDRESS  =====
// =========================
export async function updateUserAddress(
  addressId: number,
  userId: string,
  data: UpdateUserAddressInput
) {
  const address = await db
    .update(user_addresses)
    .set(data)
    .where(
      and(eq(user_addresses.id, addressId), eq(user_addresses.user_id, userId))
    )
    .returning()
  return address[0]
}
//
//
//
//
//
// =========================
// ====== DELETE ADDRESS  ==
// =========================
export async function deleteUserAddress(addressId: number, userId: string) {
  const address = await db
    .delete(user_addresses)
    .where(
      and(eq(user_addresses.id, addressId), eq(user_addresses.user_id, userId))
    )
    .returning()
  return address[0]
}
