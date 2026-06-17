import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRoutes from './routes/authRoutes.js'

const app = new Hono()

app.use('*', cors())
app.route('/api/auth', authRoutes)
app.get('/health', (c) => c.json({ status: 'ok', service: 'auth-service' }))

export default app
