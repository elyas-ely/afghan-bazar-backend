import { Context } from 'hono'
import { createProductSchema } from '../schema/product.schema'
import { getAllProducts, getProductById, createNewProduct } from '../services/product.service'

export async function getProducts(c: Context) {
  try {
    const allProducts = await getAllProducts()
    return c.json(allProducts)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getProductById(c: Context) {
  const id = Number(c.req.param('id'))

  if (!id) {
    return c.json({ error: 'Product ID is required' }, 400)
  }

  try {
    const product = await getProductById(id)

    if (!product) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json(product)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function createProduct(c: Context) {
  try {
    const body = await c.req.json()
    const validatedData = createProductSchema.parse(body)
    
    const newProduct = await createNewProduct(validatedData)
    return c.json({ product: newProduct }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid input' }, 400)
  }
}
