/**
 * PostgreSQL connection pool (auto-imported by Nuxt in /server).
 * The connection string comes from DATABASE_URL in .env.
 */
import pg from 'pg'

// By default `pg` returns DECIMAL columns as strings and DATE columns as JS Dates
// (which shift with the timezone). Return plain numbers and 'YYYY-MM-DD' strings instead,
// so responses keep the same shape the frontend already expects.
pg.types.setTypeParser(pg.types.builtins.NUMERIC, value => Number(value))
pg.types.setTypeParser(pg.types.builtins.DATE, value => value)

let pool

function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is not set. Copy .env.example to .env and add your PostgreSQL connection string.')
    }
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
  }
  return pool
}

/** Runs a parameterized query ($1, $2, …) and returns the rows. */
export async function query(text, params = []) {
  const { rows } = await getPool().query(text, params)
  return rows
}

/** Runs a query and returns the first row, or null. */
export async function queryOne(text, params = []) {
  const rows = await query(text, params)
  return rows[0] || null
}
