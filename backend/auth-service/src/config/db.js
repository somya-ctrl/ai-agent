// Cloudflare D1 HTTP API client
// D1 is SQLite-based — uses ? placeholders, not $1/$2

const D1_URL = () =>
  `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${process.env.CLOUDFLARE_D1_DATABASE_ID}/query`

const query = async (sql, params = []) => {
  const res = await fetch(D1_URL(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  })

  const data = await res.json()

  if (!data.success) {
    const errMsg = data.errors?.[0]?.message || 'D1 query failed'
    throw new Error(errMsg)
  }

  return data.result[0]
}

module.exports = { query }
