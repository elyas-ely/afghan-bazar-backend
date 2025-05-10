import { InferModel } from 'drizzle-orm'
import { users, user_addresses } from '../schema/user.schema'

export type User = InferModel<typeof users>
export type UserAddress = InferModel<typeof user_addresses>

export interface UserService {
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  createUser(data: Omit<User, 'id'>): Promise<User>
}

export interface UserAddressService {
  getUserAddresses(userId: string): Promise<UserAddress[]>
  getUserAddressById(userId: string, addressId: number): Promise<UserAddress | null>
  createUserAddress(userId: string, data: Omit<UserAddress, 'id'>): Promise<UserAddress>
  deleteUserAddress(userId: string, addressId: number): Promise<UserAddress | null>
  updateUserAddress(userId: string, addressId: number, data: Partial<UserAddress>): Promise<UserAddress | null>
}
