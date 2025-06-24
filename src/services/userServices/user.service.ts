import { db } from '../../config/database'
import { eq } from 'drizzle-orm'
import { UpdateUserInput } from '../../schema/user.schema'
import { CreateUserInput } from '../../types/user.types'
import { users } from '../../db/schema/users'

export async function getAllUsers() {
  const allUsers = await db.select().from(users).limit(10)
  return allUsers
}

export async function getUserById(userId: string) {
  const user = await db.select().from(users).where(eq(users.id, userId))
  return user[0]
}

export async function createNewUser(data: CreateUserInput) {
  const newUser = await db.insert(users).values(data).returning()
  return newUser[0]
}

export async function updateUser(userId: string, data: UpdateUserInput) {
  if (Object.keys(data).length === 0) {
    return getUserById(userId)
  }

  const updatedUser = await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning()

  return updatedUser[0]
}

/**
 * Delete a user by their ID
 */
export async function deleteUser(userId: string) {
  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning()

  return deletedUser[0]
}
