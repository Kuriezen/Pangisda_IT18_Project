/**
 * Creates the tables (schema.sql) and loads the sample data from server/data/db.js.
 * Usage: npm run db:setup   (reads DATABASE_URL from .env)
 *
 * WARNING: drops and recreates every table, so existing data is lost.
 */
import { readFile } from 'node:fs/promises'
import bcrypt from 'bcryptjs'
import pg from 'pg'
import { catches, species, spots, spotSpecies, users } from '../data/db.js'

try { process.loadEnvFile() }
catch { /* no .env file; DATABASE_URL may already be set in the environment */ }

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and add your PostgreSQL connection string.')
  process.exit(1)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

/** Inserts rows that share the same columns, keeping their sample ids. */
async function insertAll(table, rows, columns) {
  for (const row of rows) {
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
    await client.query(
      `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`,
      columns.map(c => row[c]),
    )
  }
  // Explicit ids were inserted, so move the identity sequence past them.
  if (columns.includes('id')) {
    await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), (SELECT MAX(id) FROM ${table}))`)
  }
}

try {
  await client.connect()
  await client.query('BEGIN')
  await client.query(await readFile(new URL('./schema.sql', import.meta.url), 'utf8'))

  const hashedUsers = users.map(u => ({ ...u, password_hash: bcrypt.hashSync(u.password, 10) }))
  await insertAll('users', hashedUsers, ['id', 'full_name', 'username', 'email', 'password_hash', 'role', 'created_at'])
  await insertAll('species', species, ['id', 'common_name', 'local_name', 'scientific_name', 'habitat', 'is_protected', 'conservation_note', 'image_url', 'image_credit'])
  await insertAll('fishing_spots', spots, ['id', 'name', 'municipality', 'province', 'water_type', 'latitude', 'longitude', 'best_time', 'access_level', 'description', 'created_by', 'created_at'])
  await insertAll('spot_species', spotSpecies, ['spot_id', 'species_id'])
  await insertAll('catches', catches, ['id', 'user_id', 'spot_id', 'species_id', 'weight_kg', 'length_cm', 'caught_at', 'method', 'bait', 'released', 'notes', 'created_at'])

  await client.query('COMMIT')
  console.log(`Database ready: ${users.length} users, ${spots.length} spots, ${species.length} species, ${catches.length} catches.`)
}
catch (err) {
  await client.query('ROLLBACK').catch(() => {})
  console.error('Database setup failed:', err.message)
  process.exitCode = 1
}
finally {
  await client.end()
}
