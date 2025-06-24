import { Context } from 'hono'
import { updateProductSchema } from '../schema/product.schema'
import {
  getProductById,
  updateProduct,
  deleteProduct,
  getPopularProducts,
  getRecommendedProducts,
  getSearchProducts,
  getFilteredProducts,
  getViewedProducts,
  getUserWishlist,
} from '../services/product.service'
import { ProductFilters, UpdateProductInput } from '../types/product.types'

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
    const result = await getRecommendedProducts(
      categoryId,
      offset,
      pageSize,
      userId
    )

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
  const userId = String(c.req.queries('userId'))
  const limit = 10

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
    const products = await getPopularProducts(categoryId, limit, userId)
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
  const idParam = c.req.param('pId')
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
  const limit = 6

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
    const products = await getSearchProducts(query, limit)
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
  const page = parseInt(String(c.req.queries('page'))) || 1
  const pageSize = parseInt(String(c.req.queries('pageSize'))) || 12
  const userId = c.req.queries('userId')

  if (!userId) {
    return c.json(
      {
        success: false,
        message: 'User ID is required',
      },
      400
    )
  }

  // Calculate offset from page and pageSize
  const offset = (page - 1) * pageSize

  const filters: ProductFilters = {
    query: query ? String(query) : '',
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
    offset,
    limit: pageSize,
  }

  try {
    const result = await getFilteredProducts(filters)

    return c.json({
      success: true,
      products: result.items,
      hasNextPage: result.hasNextPage,
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

export async function getWishlistProductsFn(c: Context) {
  const userId = String(c.req.queries('userId'))
  const page = parseInt(String(c.req.queries('page'))) || 1
  const pageSize = parseInt(String(c.req.queries('pageSize'))) || 12

  // Calculate offset from page and pageSize
  const offset = (page - 1) * pageSize

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

//
//
//
//
//

export async function createProduct(c: Context) {
  try {
    // const body = await c.req.json()

    // const validatedData: CreateProductInput = createProductSchema.parse(body)

    // const newProduct = await createNewProduct(validatedData)
    return c.json({ product: 'product created' }, 201)
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

export async function updateViewedProductFn(c: Context) {
  const productId = Number(c.req.param('pId'))
  const userId = String(c.req.queries('userId'))

  if (!productId || !userId) {
    return c.json(
      {
        success: false,
        message: 'Valid product or user ID is required',
      },
      400
    )
  }

  try {
    const updatedProduct = await updateViewedProduct(productId, userId)

    return c.json(
      {
        success: true,
        message: 'Product updated successfully',
        product: updatedProduct,
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

export async function updateProductFn(c: Context) {
  const idParam = c.req.param('pId')
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
