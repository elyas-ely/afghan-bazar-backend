import { Context } from 'hono'
import { getProductReviews } from '../services/review.service'

export async function getProductReview(c: Context) {
  const productId = Number(c.req.param('id'))

  if (!productId) {
    return c.json({ error: 'Product ID is required' }, 400)
  }

  try {
    const reviews = await getProductReviews(productId)
    return c.json(reviews)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
