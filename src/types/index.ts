export interface CreateProductInput {
  name: string
  description: string
  price: number
  image: string
  category: string
}

export interface CreateUserInput {
  username: string
  email: string
  profile?: string
}

export interface CreateAddressInput {
  user_id: string
  address1: string
  address2?: string
  zipcode: string
}
