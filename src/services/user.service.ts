import { and, eq } from 'drizzle-orm'
import { db } from '../config/database'
import { users, user_addresses } from '../schema/user.schema'
import { UserService, UserAddressService } from '../types/user.types'
import { AppError } from '../middleware/error.middleware'

export class UserServiceImpl implements UserService {
  async getUsers() {
    return await db.select().from(users)
  }

  async getUserById(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id))
    return result[0] || null
  }

  async createUser(data: any) {
    const result = await db.insert(users).values(data).returning()
    return result[0]
  }
}

export class UserAddressServiceImpl implements UserAddressService {
  async getUserAddresses(userId: string) {
    return await db
      .select()
      .from(user_addresses)
      .where(eq(user_addresses.user_id, userId))
  }

  async getUserAddressById(userId: string, addressId: number) {
    const result = await db
      .select()
      .from(user_addresses)
      .where(
        and(
          eq(user_addresses.id, addressId),
          eq(user_addresses.user_id, userId)
        )
      )
    return result[0] || null
  }

  async createUserAddress(userId: string, data: any) {
    const result = await db
      .insert(user_addresses)
      .values({ ...data, user_id: userId })
      .returning()
    return result[0]
  }

  async deleteUserAddress(userId: string, addressId: number) {
    const result = await db
      .delete(user_addresses)
      .where(
        and(
          eq(user_addresses.id, addressId),
          eq(user_addresses.user_id, userId)
        )
      )
      .returning()
    return result[0] || null
  }

  async updateUserAddress(userId: string, addressId: number, data: any) {
    const result = await db
      .update(user_addresses)
      .set(data)
      .where(
        and(
          eq(user_addresses.id, addressId),
          eq(user_addresses.user_id, userId)
        )
      )
      .returning()
    return result[0] || null
  }
}
