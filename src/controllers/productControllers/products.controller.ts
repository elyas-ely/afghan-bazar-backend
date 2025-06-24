import { Context } from 'hono'
import {
  getProductById,
  getPopularProducts,
  getRecommendedProducts,
  getSearchProducts,
  getFilteredProducts,
  getViewedProducts,
} from '../../services/productServices/product.service'
import { ProductFilters } from '../../types/product.types'

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

//
//
//
//
//
