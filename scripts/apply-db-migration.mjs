/**
 * Run a SQL file against Supabase Postgres (DDL / migrations).
 *
 * Set one of:
 *   DATABASE_URL — full URI from Supabase → Settings → Database → Connection string (URI)
 * or both:
 *   NEXT_PUBLIC_SUPABASE_URL — already in .env.local
 *   SUPABASE_DB_PASSWORD — Database password from the same screen (not anon / service_role keys)
 *
 * Usage:
 *   node --env-file=.env.local scripts/apply-db-migration.mjs [path-to.sql]
 * Default file: supabase/migrations/20260414120000_add_consumer_vs_commercial.sql
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function connectionString() {
  if (process.env.DATABASE_URL?.trim()) {
    return process.env.DATABASE_URL.trim();
  }
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const password = process.env.SUPABASE_DB_PASSWORD?.trim();
  if (!base || !password) {
    return null;
  }
  let host;
  try {
    host = new URL(base).hostname;
  } catch {
    return null;
  }
  const ref = host.split(".")[0];
  if (!ref) return null;
  const enc = encodeURIComponent(password);
  return `postgresql://postgres:${enc}@db.${ref}.supabase.co:5432/postgres`;
}

const conn = connectionString();
if (!conn) {
  console.error(`
Missing database connection. Add to .env.local either:

  DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres

or:

  SUPABASE_DB_PASSWORD=your_database_password

(Supabase Dashboard → Project Settings → Database → Database password)
`);
  process.exit(1);
}

const defaultSql = path.join(
  __dirname,
  "../supabase/migrations/20260414120000_add_consumer_vs_commercial.sql"
);
const sqlPath = path.resolve(process.argv[2] || defaultSql);
const sql = fs.readFileSync(sqlPath, "utf8");

const client = new pg.Client({
  connectionString: conn,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log("Connecting…");
  await client.connect();
  console.log("Applying:", sqlPath);
  await client.query(sql);
  await client.end();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e.message || e);
  client.end().catch(() => {});
  process.exit(1);
});
