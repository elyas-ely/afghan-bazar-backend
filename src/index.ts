import { Hono } from 'hono'
import { cors } from 'hono/cors'
import userRoutes from './routes/user.routes'
import productRoutes from './routes/product.routes'

const app = new Hono()

// Middleware
app.use('*', cors())

// API versioning
const v1 = new Hono()
v1.route('/users', userRoutes)
v1.route('/products', productRoutes)

app.route('/api', v1)

export default app
export const handler = app.fetch
