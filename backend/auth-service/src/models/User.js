// db = c.env.DB (Cloudflare D1 binding)

export const findByEmail = async (db, email) => {
  return await db
    .prepare('SELECT id, email, password_hash, industry, entity_id FROM users WHERE email = ?')
    .bind(email)
    .first()
}
