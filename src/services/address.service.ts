import { db } from '../config/database'
import { and, desc, eq } from 'drizzle-orm'

import {
  CreateUserAddressInput,
  UpdateUserAddressInput,
} from '../types/address.types'
import { addresses } from '../db/schema/addresses'

// =========================
// ====== GET ADDRESS  =====
// =========================
export async function getUserAddresses(userId: string) {
  const data = await db
    .select()
    .from(addresses)
    .where(eq(addresses.user_id, userId))
    .orderBy(desc(addresses.created_at))
  return data
}

export async function getUserAddressById(addressId: number, userId: string) {
  const data = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.user_id, userId)))
  return data[0]
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
  const newAddress = await db.insert(addresses).values(data).returning()
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
    .update(addresses)
    .set(data)
    .where(and(eq(addresses.id, addressId), eq(addresses.user_id, userId)))
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
    .delete(addresses)
    .where(and(eq(addresses.id, addressId), eq(addresses.user_id, userId)))
    .returning()
  return address[0]
}
