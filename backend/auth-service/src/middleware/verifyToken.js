import { verify } from 'hono/jwt'

export const verifyToken = async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ message: 'Authorization header missing' }, 401)
  }

  try {
    const token = authHeader.split(' ')[1]
    const decoded = await verify(token, c.env.JWT_SECRET)
    c.set('user', decoded)
    await next()
  } catch {
    return c.json({ message: 'Token invalid or expired' }, 401)
  }
}
