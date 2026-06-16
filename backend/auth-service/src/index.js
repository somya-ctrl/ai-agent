require('dotenv').config()
const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')

const app = express()
const PORT = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'auth-service' }))

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`)
})
