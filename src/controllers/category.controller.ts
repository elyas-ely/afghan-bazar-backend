// import { Context } from 'hono'
// import { getAllProductsByCategory } from '../services/category.service'

// export async function getAllProductsByCategoryFn(c: Context) {
//   const categoryId = Number(c.req.queries('categoryId'))

//   if (!categoryId) {
//     return c.json({ error: 'Category ID is required' }, 400)
//   }

//   try {
//     const products = await getAllProductsByCategory(categoryId)
//     return c.json(products)
//   } catch (error) {
//     console.error(error)
//     return c.json({ error: 'Internal Server Error' }, 500)
//   }
// }
