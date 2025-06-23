import { Context } from 'hono'
import { getUserOrders } from '../services/orders.sevice'

export async function getUserOrdersFn(c: Context) {
  const userId = c.req.param('userId')

  if (!userId) {
    return c.json(
      {
        success: 'false',
        message: 'User ID is required',
      },
      400
    )
  }

  try {
    const orders = await getUserOrders(userId)
    return c.json({
      success: 'true',
      orders,
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
