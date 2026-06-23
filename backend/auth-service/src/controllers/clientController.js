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

// GET /api/admin/clients — admin only, all clients across industries with billing info
export const getAllClients = async (c) => {
  const result = await getPayload(c)
  if (result.error) return c.json({ message: 'Unauthorized', reason: result.error }, 401)
  if (result.payload.industry !== 'admin') return c.json({ message: 'Forbidden' }, 403)

  let results
  try {
    const r = await c.env.DB.prepare(
      `SELECT id, name, industry, type, location, monthly_rate, payment_status
       FROM clients WHERE is_active = 1 ORDER BY industry, name`
    ).all()
    results = r.results
  } catch {
    // billing columns not yet migrated — return defaults
    const r = await c.env.DB.prepare(
      `SELECT id, name, industry, type, location,
              0 as monthly_rate, 'pending' as payment_status
       FROM clients WHERE is_active = 1 ORDER BY industry, name`
    ).all()
    results = r.results
  }

  const revenue = results.reduce((s, cl) => s + (cl.payment_status === 'paid' ? Number(cl.monthly_rate || 0) : 0), 0)
  const pending = results.reduce((s, cl) => s + (cl.payment_status !== 'paid' ? Number(cl.monthly_rate || 0) : 0), 0)

  return c.json({ clients: results, stats: { total: results.length, revenue, pending } })
}

// GET /api/admin/chart — admin only, daily calls aggregated by industry (last 30 days)
export const getChartData = async (c) => {
  const result = await getPayload(c)
  if (result.error) return c.json({ message: 'Unauthorized', reason: result.error }, 401)
  if (result.payload.industry !== 'admin') return c.json({ message: 'Forbidden' }, 403)

  const { results } = await c.env.DB.prepare(`
    SELECT cm.date, c.industry, SUM(cm.calls_total) as calls
    FROM client_metrics cm
    JOIN clients c ON cm.client_id = c.id
    WHERE cm.date >= date('now', '-29 days')
    GROUP BY cm.date, c.industry
    ORDER BY cm.date ASC
  `).all()

  // Pivot into { date, restaurant, insurance } rows for recharts
  const map = {}
  for (const row of results) {
    if (!map[row.date]) map[row.date] = { date: row.date, restaurant: 0, insurance: 0 }
    map[row.date][row.industry] = Number(row.calls || 0)
  }

  return c.json({ chartData: Object.values(map) })
}

// POST /api/clients — admin only, create a new client
export const createClient = async (c) => {
  const result = await getPayload(c)
  if (result.error) return c.json({ message: 'Unauthorized', reason: result.error }, 401)
  if (result.payload.industry !== 'admin') return c.json({ message: 'Forbidden' }, 403)

  let body
  try { body = await c.req.json() }
  catch { return c.json({ message: 'Invalid JSON body' }, 400) }

  const { name, industry, type, location, monthly_rate, payment_status } = body
  if (!name || !industry) return c.json({ message: 'name and industry are required' }, 400)

  const id = crypto.randomUUID()
  const webhook_key = crypto.randomUUID()

  try {
    await c.env.DB.prepare(
      `INSERT INTO clients (id, name, industry, type, location, webhook_key, is_active, monthly_rate, payment_status)
       VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`
    ).bind(id, name.trim(), industry, type || '', location || '', webhook_key, monthly_rate || 0, payment_status || 'pending').run()
  } catch {
    // billing columns not yet migrated — insert without them
    await c.env.DB.prepare(
      `INSERT INTO clients (id, name, industry, type, location, webhook_key, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`
    ).bind(id, name.trim(), industry, type || '', location || '', webhook_key).run()
  }

  return c.json({
    message: 'Client created successfully',
    client: {
      id, name: name.trim(), industry,
      type: type || '', location: location || '',
      monthly_rate: monthly_rate || 0,
      payment_status: payment_status || 'pending',
      webhook_key,
    },
  }, 201)
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
