import { findClientByWebhookKey } from '../models/Client.js'

// POST /api/agent/session?key=<webhook_key>
// Called by the AI agent after every call — no JWT, uses webhook_key per client
export const logSession = async (c) => {
  const key = c.req.query('key')
  if (!key) return c.json({ message: 'Missing webhook key' }, 401)

  const client = await findClientByWebhookKey(c.env.DB, key)
  if (!client) return c.json({ message: 'Invalid webhook key' }, 401)

  let body
  try { body = await c.req.json() }
  catch { return c.json({ message: 'Invalid JSON body' }, 400) }

  const sessionId = crypto.randomUUID()
  const isResolved = body.resolved ? 1 : 0
  const isBooking  = body.intent === 'booking' ? 1 : 0
  const duration   = body.duration_sec || 0

  await c.env.DB.prepare(`
    INSERT INTO agent_sessions
      (id, client_id, caller_phone, duration_sec, intent, resolved, transcript, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).bind(
    sessionId, client.id,
    body.caller_phone || null,
    duration,
    body.intent || 'inquiry',
    isResolved,
    body.transcript || null
  ).run()

  // Upsert today's daily rollup
  const today = new Date().toISOString().slice(0, 10)
  await c.env.DB.prepare(`
    INSERT INTO client_metrics (client_id, date, calls_total, calls_resolved, avg_duration, bookings)
    VALUES (?, ?, 1, ?, ?, ?)
    ON CONFLICT(client_id, date) DO UPDATE SET
      calls_total    = calls_total + 1,
      calls_resolved = calls_resolved + ?,
      avg_duration   = ((avg_duration * calls_total) + ?) / (calls_total + 1),
      bookings       = bookings + ?
  `).bind(
    client.id, today,
    isResolved, isBooking,   // INSERT values
    isResolved, duration, isBooking  // UPDATE values
  ).run()

  return c.json({ ok: true, session_id: sessionId })
}
