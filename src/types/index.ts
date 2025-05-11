export interface CreateUserInput {
  id: string
  username: string
  email: string
  profile?: string
  phone_number?: string
}

export interface User extends CreateUserInput {
  created_at?: Date
}

export interface CreateAddressInput {
  user_id: string
  address1: string
  address2?: string
  zipcode: string
}

export interface CreateProductInput {
  name: string
  description: string
  price: number
  image: string
  category: string
}
