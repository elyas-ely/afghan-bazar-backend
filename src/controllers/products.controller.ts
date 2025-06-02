import { Context } from 'hono'
import {
  createProductSchema,
  updateProductSchema,
} from '../schema/product.schema'
import {
  getProductById,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getPopularProducts,
  getRecommendedProducts,
  getSearchProducts,
  getFilteredProducts,
  getViewedProducts,
} from '../services/product.service'
import {
  CreateProductInput,
  ProductFilters,
  UpdateProductInput,
} from '../types/product.types'

export async function getRecommendedProductsFn(c: Context) {
  const categoryId = Number(c.req.queries('categoryId'))
  const userId = String(c.req.queries('userId'))
  const page = parseInt(String(c.req.queries('page'))) || 1
  const pageSize = parseInt(String(c.req.queries('pageSize'))) || 12
  const offset = (page - 1) * pageSize

  if (isNaN(categoryId) || !userId) {
    return c.json(
      {
        success: false,
        message: 'Category ID and User ID are required',
        code: 'INVALID_PARAMETERS',
      },
      400
    )
  }

  try {
    const result = await getRecommendedProducts(categoryId, offset, pageSize)

    return c.json({
      success: true,
      products: result.items,
      hasNextPage: result.hasNextPage,
    })
  } catch (error) {
    console.error(`Error getting recommended products:`, error)
    return c.json(
      {
        success: false,
        message: 'Failed to get recommended products',
        error: (error as Error).message,
      },
      500
    )
  }
}

export async function getPopularProductsFn(c: Context) {
  const categoryId = Number(c.req.queries('categoryId'))

  if (isNaN(categoryId)) {
    return c.json(
      {
        success: false,
        message: 'Category ID is required and must be a number',
        code: 'CATEGORY_ID_INVALID',
      },
      400
    )
  }

  try {
    const products = await getPopularProducts(categoryId)
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

export async function getProductByIdFn(c: Context) {
  const idParam = c.req.param('id')
  const productId = Number(idParam)

  if (!productId) {
    return c.json(
      {
        success: false,
        message: 'Product ID is required and must be a number',
      },
      400
    )
  }

  try {
    const product = await getProductById(productId)

    if (!product) {
      return c.json(
        {
          success: false,
          message: 'Product not found',
        },
        404
      )
    }

    return c.json({
      success: true,
      product,
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

export async function getSearchProductsFn(c: Context) {
  const query = String(c.req.queries('query'))

  if (!query) {
    return c.json(
      {
        success: false,
        message: 'Search query is required',
      },
      400
    )
  }

  try {
    const products = await getSearchProducts(query)
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

export async function getFilteredProductsFn(c: Context) {
  const query = c.req.queries('query')
  const categoryIdRaw = c.req.queries('categoryId')
  const minPriceRaw = c.req.queries('minPrice')
  const maxPriceRaw = c.req.queries('maxPrice')

  if (!query) {
    return c.json(
      {
        success: false,
        message: 'Search query is required',
      },
      400
    )
  }

  const filters: ProductFilters = {
    query: String(query),
    categoryId:
      categoryIdRaw && !isNaN(Number(categoryIdRaw))
        ? Number(categoryIdRaw)
        : 0,
    minPrice:
      minPriceRaw && !isNaN(Number(minPriceRaw))
        ? Number(minPriceRaw)
        : undefined,
    maxPrice:
      maxPriceRaw && !isNaN(Number(maxPriceRaw))
        ? Number(maxPriceRaw)
        : undefined,
  }

  try {
    const products = await getFilteredProducts(filters)

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
//
//
//
//
//

export async function createProduct(c: Context) {
  try {
    const body = await c.req.json()

    const validatedData: CreateProductInput = createProductSchema.parse(body)

    const newProduct = await createNewProduct(validatedData)
    return c.json({ product: newProduct }, 201)
  } catch (error) {
    console.error(error)
    return c.json(
      {
        success: false,
        message: 'Invalid product data',
      },
      400
    )
  }
}

export async function updateProductFn(c: Context) {
  const idParam = c.req.param('id')
  const productId = Number(idParam)

  if (!productId) {
    return c.json(
      {
        success: false,
        message: 'Valid product ID is required',
      },
      400
    )
  }

  try {
    // First check if product exists
    const existingProduct = await getProductById(productId)
    if (!existingProduct) {
      return c.json(
        {
          success: false,
          message: 'Product not found',
        },
        404
      )
    }

    const body = await c.req.json()
    // Parse and validate the input data through schema
    const validatedData: UpdateProductInput = updateProductSchema.parse(body)

    if (Object.keys(validatedData).length === 0) {
      return c.json(
        {
          success: false,
          message: 'No valid fields to update provided',
        },
        400
      )
    }

    // The service will handle the price conversion
    const updatedProduct = await updateProduct(productId, validatedData as any)

    return c.json(
      {
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct,
      },
      200
    )
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return c.json(
        {
          success: false,
          message: error.errors,
        },
        400
      )
    }

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

export async function deleteProductFn(c: Context) {
  const idParam = c.req.param('id')
  const productId = Number(idParam)

  if (!productId) {
    return c.json(
      {
        success: false,
        message: 'Valid product ID is required',
      },
      400
    )
  }

  try {
    const deletedProduct = await deleteProduct(productId)

    if (!deletedProduct) {
      return c.json(
        {
          success: false,
          message: 'Product not found',
        },
        404
      )
    }

    return c.json(
      {
        success: true,
        message: 'Product deleted successfully',
        product: deletedProduct,
      },
      200
    )
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
