export const findClientsByIndustry = (db, industry) =>
  db.prepare(
    `SELECT id, name, type, location FROM clients
     WHERE industry = ? AND is_active = 1 ORDER BY name`
  ).bind(industry).all()

export const findClientById = (db, id) =>
  db.prepare(
    `SELECT id, name, industry, type, location FROM clients WHERE id = ?`
  ).bind(id).first()

export const findClientByWebhookKey = (db, key) =>
  db.prepare(
    `SELECT id FROM clients WHERE webhook_key = ? AND is_active = 1`
  ).bind(key).first()
