import { Context } from 'hono'
import { db } from '../config/database'
import { eq } from 'drizzle-orm'

import { createProductSchema, products } from '../schema/product.schema'

export async function getProducts(c: Context) {
  try {
    const allProducts = await db
      .select()
      .from(products)
      .limit(10)
      .orderBy(products.created_at)
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

    const productToInsert = {
      ...validatedData,
      price: validatedData.price.toString(),
      images: validatedData.images,
      tags: validatedData.tags || null,
      ingredients: validatedData.ingredients || null,
    }

    const newProduct = await db
      .insert(products)
      .values(productToInsert)
      .returning()

    return c.json({ product: newProduct[0] }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}
