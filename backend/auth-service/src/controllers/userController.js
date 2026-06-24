import bcrypt from 'bcryptjs'
import { verify } from 'hono/jwt'

const getAdminPayload = async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  try {
    const payload = await verify(auth.slice(7), c.env.JWT_SECRET, 'HS256')
    return payload.industry === 'admin' ? payload : null
  } catch {
    return null
  }
}

// POST /api/users  — admin only
export const createUser = async (c) => {
  const admin = await getAdminPayload(c)
  if (!admin) return c.json({ message: 'Unauthorized' }, 401)

  let body
  try { body = await c.req.json() }
  catch { return c.json({ message: 'Invalid JSON body' }, 400) }

  const { email, password, industry, entity_id } = body

  if (!email || !password || !industry) {
    return c.json({ message: 'email, password and industry are required' }, 400)
  }

  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email.toLowerCase().trim()).first()

  if (existing) {
    return c.json({ message: 'A user with this email already exists' }, 409)
  }

  const password_hash = await bcrypt.hash(password, 10)
  const id = crypto.randomUUID()

  await c.env.DB.prepare(`
    INSERT INTO users (id, email, password_hash, industry, entity_id)
    VALUES (?, ?, ?, ?, ?)
  `).bind(id, email.toLowerCase().trim(), password_hash, industry, entity_id || null).run()

  return c.json({
    message: 'User created successfully',
    user: {
      id,
      email: email.toLowerCase().trim(),
      industry,
      entity_id: entity_id || null,
    },
  }, 201)
}

// GET /api/users  — admin only, list all non-admin users
export const listUsers = async (c) => {
  const admin = await getAdminPayload(c)
  if (!admin) return c.json({ message: 'Unauthorized' }, 401)

  const { results } = await c.env.DB.prepare(
    `SELECT id, email, industry, entity_id FROM users WHERE industry != 'admin' ORDER BY industry, email`
  ).all()

  return c.json({ users: results })
}
