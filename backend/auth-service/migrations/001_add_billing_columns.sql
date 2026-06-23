-- Run this once in the Cloudflare D1 console (or via wrangler d1 execute)
-- to add billing columns to the clients table.
--
--   wrangler d1 execute agentai-auth --file=migrations/001_add_billing_columns.sql

ALTER TABLE clients ADD COLUMN monthly_rate    REAL    DEFAULT 0;
ALTER TABLE clients ADD COLUMN payment_status  TEXT    DEFAULT 'pending';
