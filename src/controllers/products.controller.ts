import { Context } from 'hono'
import { db } from '../config/database'
import { desc, eq } from 'drizzle-orm'

import { createProductSchema, products } from '../schema/product.schema'

export async function getProducts(c: Context) {
  try {
    const allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.created_at))
      .limit(10)
    return c.json(allProducts)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getProductById(c: Context) {
  const id = c.req.param('id')

  if (!id || isNaN(Number(id))) {
    return c.json({ error: 'Invalid product ID' }, 400)
  }

  try {
    const product = await db
      .select()
      .from(products)
      .where(eq(products.id, Number(id)))

    if (!product.length) {
      return c.json({ error: 'product not found' }, 404)
    }

    return c.json({ product: product[0] })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function createProduct(c: Context) {
  try {
    const body = await c.req.json()
    const validatedData = createProductSchema.parse(body)

    const newProduct = await db
      .insert(products)
      .values({
        ...validatedData,
        price: validatedData.price.toString(),
      })
      .returning()

    return c.json({ product: newProduct[0] }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}
