import { Hono } from 'hono'
import {
  createUserAddress,
  deleteUserAddressById,
  getUserAddress,
  getUserAddressById,
  updateUserAddress,
} from '../controllers/address.controller'

const addressRouter = new Hono()

addressRouter.get('/', getUserAddress)
addressRouter.get('/:addressId', getUserAddressById)
addressRouter.post('/', createUserAddress)
addressRouter.put('/:addressId', updateUserAddress)
addressRouter.delete('/:addressId', deleteUserAddressById)

export default addressRouter
