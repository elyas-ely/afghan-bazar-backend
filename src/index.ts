import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'
import { env } from './config/env'

const app = new Hono()

// Middleware
app.use('*', cors())

// API versioning
const v1 = new Hono()
v1.route('/users', userRoutes)
v1.route('/products', productRoutes)

app.route('/api', v1)

// For local development
if (env.NODE_ENV === 'development') {
  console.log(`Server is running on port ${env.PORT}`)
}

// For Vercel - export a fetch function directly
export default function(req: Request) {
  return app.fetch(req)
}
