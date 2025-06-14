import { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import {
  updateUserAddressSchema,
  createUserAddressSchema,
} from '../schema/address.schema'
import { z } from 'zod'
import { addresses } from '../db/schema/addresses'

/**
 * Address Types
 */

// Address entity and input types
export type UserAddress = InferSelectModel<typeof addresses>
export type CreateUserAddressInput = InferInsertModel<typeof addresses>
export type UpdateUserAddressInput = z.infer<typeof updateUserAddressSchema>

// Address service interface
export interface UserAddressService {
  getUserAddresses(userId: string): Promise<UserAddress[]>

  getUserAddressById(
    userId: string,
    addressId: number
  ): Promise<UserAddress | null>

  createUserAddress(
    userId: string,
    data: CreateUserAddressInput
  ): Promise<UserAddress>

  deleteUserAddress(
    userId: string,
    addressId: number
  ): Promise<UserAddress | null>

  updateUserAddress(
    userId: string,
    addressId: number,
    data: Partial<UserAddress>
  ): Promise<UserAddress | null>
}
