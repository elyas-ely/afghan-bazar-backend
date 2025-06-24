import { Context } from 'hono'
import { addToWishlist } from '../../services/userServices/wishlist.service'
import { getUserWishlist } from '../../services/userServices/wishlist.service'

export async function getSavesProductsFn(c: Context) {
  const userId = String(c.req.param('userId'))
  const page = parseInt(String(c.req.queries('page'))) || 1
  const pageSize = parseInt(String(c.req.queries('pageSize'))) || 12
  const offset = (page - 1) * pageSize

  if (!userId) {
    return c.json(
      {
        success: false,
        message: 'User ID is required',
        code: 'INVALID_PARAMETERS',
      },
      400
    )
  }

  try {
    const result = await getUserWishlist(offset, pageSize, userId)
    return c.json({
      success: true,
      products: result.items,
      hasNextPage: result.hasNextPage,
    })
  } catch (error) {
    console.error(`Error getting wishlist:`, error)
    return c.json(
      {
        success: false,
        message: 'Failed to get wishlist',
        error: (error as Error).message,
      },
      500
    )
  }
}

export async function addToWishlistFn(c: Context) {
  const userId = String(c.req.param('userId'))

  if (!userId) {
    return c.json(
      {
        success: false,
        message: 'User ID is required',
      },
      400
    )
  }
  try {
    const body = await c.req.json()
    const productId = Number(body.productId)

    if (!productId) {
      return c.json(
        {
          success: false,
          message: 'Product ID is required',
        },
        400
      )
    }
    const wishlist = await addToWishlist(userId, productId)
    return c.json({
      success: true,
      wishlist,
    })
  } catch (error) {
    console.error(error)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      500
    )
  }
}
