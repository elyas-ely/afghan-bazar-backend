import { Context } from 'hono'
import {
  getViewedProducts,
  updateViewedProduct,
} from '../../services/userServices/viewed.service'

export async function getViewedProductsFn(c: Context) {
  const userId = String(c.req.queries('userId'))

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
    const products = await getViewedProducts(userId)

    return c.json({
      success: true,
      products,
    })
  } catch (error) {
    console.error(error)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
        code: 'INTERNAL_ERROR',
      },
      500
    )
  }
}

export async function updateViewedProductFn(c: Context) {
  const userId = String(c.req.param('userId'))

  if (!userId) {
    return c.json(
      {
        success: false,
        message: 'Valid user ID is required',
      },
      400
    )
  }

  try {
    const validateData = await c.req.json()
    const productId = validateData.productId

    if (!productId) {
      return c.json(
        {
          success: false,
          message: 'Valid product ID is required',
        },
        400
      )
    }

    const updatedProduct = await updateViewedProduct(productId, userId)

    return c.json(
      {
        success: true,
        message: 'Product viewed successfully',
        updatedProduct,
      },
      200
    )
  } catch (error: any) {
    console.log(error)
    return c.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      500
    )
  }
}
