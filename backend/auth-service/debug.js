// Run: node debug.js <email> <password>
// Checks D1 connection and shows exactly where login fails

require('dotenv').config()
const bcrypt = require('bcryptjs')

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.log('Usage: node debug.js your@email.com yourpassword')
  process.exit(1)
}

const D1_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_D1_DATABASE_ID}/query`

async function run() {
  console.log('\n--- Step 1: D1 Connection ---')
  console.log('Account ID :', process.env.CLOUDFLARE_ACCOUNT_ID ? 'set' : 'MISSING')
  console.log('Database ID:', process.env.CLOUDFLARE_D1_DATABASE_ID ? 'set' : 'MISSING')
  console.log('API Token  :', process.env.CLOUDFLARE_API_TOKEN ? 'set' : 'MISSING')

  console.log('\n--- Step 2: Query D1 for user ---')
  const res = await fetch(D1_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql: 'SELECT id, email, password_hash, industry, entity_id FROM users WHERE email = ?',
      params: [email.toLowerCase().trim()],
    }),
  })

  const data = await res.json()

  if (!data.success) {
    console.log('D1 ERROR:', JSON.stringify(data.errors, null, 2))
    return
  }

  const user = data.result[0]?.results[0]

  if (!user) {
    console.log('RESULT: No user found for email:', email)
    console.log('Fix: Check spelling or run the INSERT again in D1 console')
    return
  }

  console.log('RESULT: User found')
  console.log('  email    :', user.email)
  console.log('  industry :', user.industry)
  console.log('  entity_id:', user.entity_id)
  console.log('  hash     :', user.password_hash)

  console.log('\n--- Step 3: Password check ---')
  const isHash = user.password_hash?.startsWith('$2')
  if (!isHash) {
    console.log('PROBLEM: password_hash looks like plain text, not a bcrypt hash')
    console.log('Fix: Run this SQL in your D1 console to update it:')
    const hash = await bcrypt.hash(password, 10)
    console.log(`\n  UPDATE users SET password_hash = '${hash}' WHERE email = '${email}';\n`)
    return
  }

  const match = await bcrypt.compare(password, user.password_hash)
  if (match) {
    console.log('Password: MATCHES — login should work')
  } else {
    console.log('Password: DOES NOT MATCH')
    console.log('Fix: Run this SQL in your D1 console to reset it:')
    const hash = await bcrypt.hash(password, 10)
    console.log(`\n  UPDATE users SET password_hash = '${hash}' WHERE email = '${email}';\n`)
  }
}

run().catch((err) => console.error('Unexpected error:', err.message))
