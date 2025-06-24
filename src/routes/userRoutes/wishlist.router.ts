import { Hono } from 'hono'
import {
  addToWishlistFn,
  getSavesProductsFn,
} from '../../controllers/userControllers/wishlist.controller'

const wishlistRouter = new Hono()

wishlistRouter.get('/', getSavesProductsFn)
wishlistRouter.post('/', addToWishlistFn)

export default wishlistRouter
