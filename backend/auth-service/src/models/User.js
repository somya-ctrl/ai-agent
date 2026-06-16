const pool = require('../config/db')

/*
  Expected table:
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    industry VARCHAR(50) NOT NULL,   -- 'restaurant' | 'insurance'
    entity_id UUID NOT NULL,         -- restaurant_id or insurance_id
    created_at TIMESTAMP DEFAULT NOW()
  );
*/

const findByEmail = async (email) => {
  const result = await pool.query(
    'SELECT id, email, password_hash, industry, entity_id FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0] || null
}

module.exports = { findByEmail }
