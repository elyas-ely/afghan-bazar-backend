import { Hono } from 'hono'
import {
  getViewedProductsFn,
  updateViewedProductFn,
} from '../../controllers/userControllers/viewed.controller'

const viewedProductsRouter = new Hono()
viewedProductsRouter.get('/', getViewedProductsFn)
viewedProductsRouter.post('/', updateViewedProductFn)

export default viewedProductsRouter
