import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { updateUserSchema } from '../schema/user.schema'
import { z } from 'zod'
import { users } from '../db/schema/users'

/**
 * User Types
 */

// User entity and input types
export type User = InferSelectModel<typeof users>
export type CreateUserInput = InferInsertModel<typeof users>
export type UpdateUserInput = z.infer<typeof updateUserSchema>

// User service interface
export interface UserService {
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  createUser(data: CreateUserInput): Promise<User>
  updateUser(id: string, data: UpdateUserInput): Promise<User | null>
}

// Note: Address-related types are now in address.types.ts
