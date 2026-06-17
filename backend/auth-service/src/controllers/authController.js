import bcrypt from 'bcryptjs'
import { sign, verify } from 'hono/jwt'
import { findByEmail } from '../models/User.js'

export const login = async (c) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ message: 'email and password are required' }, 400)
    }

    const user = await findByEmail(c.env.DB, email.toLowerCase().trim())

    if (!user) {
      return c.json({ message: 'Invalid credentials' }, 401)
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return c.json({ message: 'Invalid credentials' }, 401)
    }

    const payload = {
      userId: user.id,
      email: user.email,
      industry: user.industry,
      entity_id: user.entity_id,
      vertical: user.industry,
      exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
    }

    const token = await sign(payload, c.env.JWT_SECRET)

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        industry: user.industry,
        entity_id: user.entity_id,
      },
    })
  } catch (err) {
    console.error('Login error:', err.message)
    return c.json({ message: 'Internal server error' }, 500)
  }
}

export const verifyToken = async (c) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ message: 'No token provided' }, 401)
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = await verify(token, c.env.JWT_SECRET)
    return c.json({ valid: true, payload: decoded })
  } catch {
    return c.json({ valid: false, message: 'Token invalid or expired' }, 401)
  }
}
