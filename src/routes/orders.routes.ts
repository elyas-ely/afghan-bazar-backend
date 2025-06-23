import { Hono } from 'hono'
import { getUserOrdersFn } from '../controllers/orders.controller'

const ordersRouter = new Hono()

ordersRouter.get('/', getUserOrdersFn)
// ordersRouter.get('/:addressId', getUserAddressByIdFn)
// ordersRouter.post('/', createUserAddressFn)
// ordersRouter.patch('/:addressId', updateUserAddressFn)
// ordersRouter.delete('/:addressId', deleteUserAddressFn)

export default ordersRouter
