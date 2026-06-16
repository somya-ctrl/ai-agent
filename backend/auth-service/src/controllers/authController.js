const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { findByEmail } = require('../models/User')

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password, industry } = req.body

    if (!email || !password || !industry) {
      return res.status(400).json({ message: 'email, password and industry are required' })
    }

    const user = await findByEmail(email.toLowerCase().trim())

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (user.industry !== industry) {
      return res.status(403).json({ message: `Account is not registered for the ${industry} industry` })
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const payload = {
      userId: user.id,
      email: user.email,
      industry: user.industry,
      entity_id: user.entity_id,
      vertical: user.industry,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    })

    return res.status(200).json({
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
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// POST /api/auth/verify  — validates a token (called by API gateway)
const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return res.status(200).json({ valid: true, payload: decoded })
  } catch (err) {
    return res.status(401).json({ valid: false, message: 'Token invalid or expired' })
  }
}

module.exports = { login, verifyToken }
