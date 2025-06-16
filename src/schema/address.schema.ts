import { z } from 'zod'

export const createUserAddressSchema = z.object({
  user_id: z.string(),
  address_name: z.string(),
  full_name: z.string(),
  street_address: z.string(),
  apartment: z.string().optional(),
  city: z.string(),
  province: z.string(),
  zip_code: z.string(),
  country: z.string(),
  phone_number: z.string(),
})

// Update schema with all fields optional for partial updates
export const updateUserAddressSchema = z.object({
  address_name: z.string().optional(),
  full_name: z.string().optional(),
  street_address: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  phone_number: z.string().optional(),
})
