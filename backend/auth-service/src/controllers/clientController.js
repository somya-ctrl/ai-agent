import { verify } from 'hono/jwt'
import { findClientsByIndustry, findClientById } from '../models/Client.js'

const getPayload = async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return { error: 'no_auth_header' }
  if (!c.env.JWT_SECRET) return { error: 'jwt_secret_not_set' }
  try {
    const payload = await verify(auth.slice(7), c.env.JWT_SECRET, 'HS256')
    return { payload }
  } catch (err) {
    return { error: err.message || 'verify_failed' }
  }
}

// GET /api/clients/:industry  — admin only
export const getClients = async (c) => {
  const result = await getPayload(c)
  if (result.error) return c.json({ message: 'Unauthorized', reason: result.error }, 401)
  const payload = result.payload
  if (payload.industry !== 'admin') return c.json({ message: 'Forbidden' }, 403)

  const { industry } = c.req.param()
  const { results } = await findClientsByIndustry(c.env.DB, industry)
  return c.json({ clients: results })
}

// GET /api/dashboard/:clientId  — admin or that client's own user
export const getDashboardData = async (c) => {
  const result = await getPayload(c)
  if (result.error) return c.json({ message: 'Unauthorized', reason: result.error }, 401)
  const payload = result.payload

  const { clientId } = c.req.param()
  const isAdmin = payload.industry === 'admin'
  const isOwner = payload.entity_id === clientId

  if (!isAdmin && !isOwner) return c.json({ message: 'Forbidden' }, 403)

  const client = await findClientById(c.env.DB, clientId)
  if (!client) return c.json({ message: 'Client not found' }, 404)

  const [metrics, sessions] = await Promise.all([
    c.env.DB.prepare(
      `SELECT date, calls_total, calls_resolved, avg_duration, bookings
       FROM client_metrics WHERE client_id = ? ORDER BY date DESC LIMIT 30`
    ).bind(clientId).all(),

    c.env.DB.prepare(
      `SELECT caller_phone, duration_sec, intent, resolved, created_at
       FROM agent_sessions WHERE client_id = ? ORDER BY created_at DESC LIMIT 20`
    ).bind(clientId).all(),
  ])

  return c.json({
    client,
    metrics: metrics.results,
    sessions: sessions.results,
  })
}
