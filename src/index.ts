import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { env } from './config/env'
import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors())

// Health check
app.get('/health', (c) => c.json({ status: 'ok' }))

// Routes
app.route('/users', userRoutes)
app.route('/products', productRoutes)

// Start server
const port = Number(env.PORT)

console.log(`Server is starting on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
