import { Hono } from 'hono'
import {
  createUserAddressFn,
  deleteUserAddressFn,
  getUserAddressByIdFn,
  getUserAddressesFn,
  updateUserAddressFn,
} from '../controllers/address.controller'

const addressRouter = new Hono()

addressRouter.get('/', getUserAddressesFn)
addressRouter.get('/:addressId', getUserAddressByIdFn)
addressRouter.post('/', createUserAddressFn)
addressRouter.put('/:addressId', updateUserAddressFn)
addressRouter.delete('/:addressId', deleteUserAddressFn)

export default addressRouter
