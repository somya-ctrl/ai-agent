import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/authRoutes.js'
import dataRoutes from './routes/clientRoutes.js'

const app = new Hono()

app.use('*', cors())
app.route('/api/auth', authRoutes)
app.route('/api', dataRoutes)
app.get('/health', (c) => c.json({
  status: 'ok',
  service: 'auth-service',
  hasJwtSecret: !!c.env.JWT_SECRET,
  secretLen: c.env.JWT_SECRET?.length ?? 0,
}))

export default app
