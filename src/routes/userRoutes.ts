import { Hono } from 'hono'

const router = new Hono()

// =======================================
// ============== GET ROUTES =============
// =======================================
router.get('/', (c) => {
  return c.json({
    message: 'Hello from user routes',
  })
})

export default router
