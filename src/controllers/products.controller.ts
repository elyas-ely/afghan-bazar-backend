import { Context } from 'hono'
import {
  createProductSchema,
  updateProductSchema,
} from '../schema/product.schema'
import {
  getAllProducts,
  getProductById,
  createNewProduct,
  updateProduct,
  deleteProduct,
} from '../services/product.service'
import { CreateProductInput, UpdateProductInput } from '../types/product.types'

export async function getRecommendedProducts(c: Context) {
  const categoryId = Number(c.req.queries('categoryId'))

  if (!categoryId) {
    return c.json({ error: 'Category ID is required' }, 400)
  }

  try {
    const products = await getAllProducts(categoryId)
    return c.json(products)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getPopularProductsFn(c: Context) {
  const categoryId = Number(c.req.queries('categoryId'))

  if (!categoryId) {
    return c.json({ error: 'Category ID is required' }, 400)
  }

  try {
    const products = await getAllProducts(categoryId)
    return c.json(products)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function getProductByIdFn(c: Context) {
  const idParam = c.req.param('id')
  const productId = Number(idParam)

  if (!productId || isNaN(productId)) {
    return c.json({ error: 'Product ID is required and must be a number' }, 400)
  }

  try {
    const product = await getProductById(productId)

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

    const validatedData: CreateProductInput = createProductSchema.parse(body)

    const newProduct = await createNewProduct(validatedData)
    return c.json({ product: newProduct }, 201)
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Invalid product data' }, 400)
  }
}

export async function updateProductFn(c: Context) {
  const idParam = c.req.param('id')
  const productId = Number(idParam)

  if (!productId || isNaN(productId)) {
    return c.json({ error: 'Valid product ID is required' }, 400)
  }

  try {
    // First check if product exists
    const existingProduct = await getProductById(productId)
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404)
    }

    const body = await c.req.json()
    // Parse and validate the input data through schema
    const validatedData: UpdateProductInput = updateProductSchema.parse(body)

    if (Object.keys(validatedData).length === 0) {
      return c.json({ error: 'No valid fields to update provided' }, 400)
    }

    // The service will handle the price conversion
    const updatedProduct = await updateProduct(productId, validatedData as any)

    return c.json({ product: updatedProduct })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json({ error: error.errors }, 400)
    }

    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}

export async function deleteProductFn(c: Context) {
  const idParam = c.req.param('id')
  const productId = Number(idParam)

  if (!productId || isNaN(productId)) {
    return c.json({ error: 'Valid product ID is required' }, 400)
  }

  try {
    const deletedProduct = await deleteProduct(productId)

    if (!deletedProduct) {
      return c.json({ error: 'Product not found' }, 404)
    }

    return c.json({
      message: 'Product deleted successfully',
      product: deletedProduct,
    })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
