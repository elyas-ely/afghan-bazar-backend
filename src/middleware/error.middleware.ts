import { Context, Next } from 'hono'

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export async function errorHandler(c: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    console.error(error)

    if (error instanceof AppError) {
      return c.json({ error: error.message })
    }

    return c.json({ error: 'Internal Server Error' }, 500)
  }
}
