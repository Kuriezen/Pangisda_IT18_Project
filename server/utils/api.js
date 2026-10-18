/**
<<<<<<< HEAD
 * Helpers shared by the mock API routes (auto-imported by Nuxt in /server).
 *
 * Every response follows the same envelope that the real backend will use:
 *   success → { success: true, data, meta? }
 *   error   → { success: false, error: { code, message, details? } }
 */
import { db } from '../data/db.js'
=======
 * Helpers shared by the API routes (auto-imported by Nuxt in /server).
 *
 * Every response follows the same envelope:
 *   success → { success: true, data, meta? }
 *   error   → { success: false, error: { code, message, details? } }
 */
import jwt from 'jsonwebtoken'
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888

export function apiOk(data, meta) {
  return meta ? { success: true, data, meta } : { success: true, data }
}

export function apiFail(event, status, code, message, details) {
  setResponseStatus(event, status)
  const error = { code, message }
  if (details && Object.keys(details).length) error.details = details
  return { success: false, error }
}

<<<<<<< HEAD
/** Simulates network latency so loading states can be seen during the demo. */
export function mockDelay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** Never send the password field to the client. */
export function publicUser(user) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

/** Mock token. The real backend will issue a signed JWT instead. */
export function makeMockToken(user) {
  return `mock.${user.id}.${Date.now().toString(36)}`
}

/** Reads "Authorization: Bearer mock.<userId>.<stamp>" and returns the user, or null. */
export function getAuthUser(event) {
  const header = getHeader(event, 'authorization') || ''
  const match = header.match(/^Bearer mock\.(\d+)\./)
  if (!match) return null
  return db.users.find(u => u.id === Number(match[1])) || null
=======
/** Columns of `users` that are safe to send to the client (never password_hash). */
export const USER_COLUMNS = 'id, full_name, username, email, role, created_at'

function jwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET
  if (import.meta.dev) return 'pangisda-dev-only-secret'
  throw new Error('JWT_SECRET is not set.')
}

/** Signed login token that expires after 7 days (same as the session cookie). */
export function makeToken(user) {
  return jwt.sign({ sub: String(user.id), role: user.role }, jwtSecret(), { expiresIn: '7d' })
}

/** Reads "Authorization: Bearer <jwt>" and returns the user, or null if missing/invalid/expired. */
export async function getAuthUser(event) {
  const header = getHeader(event, 'authorization') || ''
  const match = header.match(/^Bearer (.+)$/)
  if (!match) return null
  let payload
  try {
    payload = jwt.verify(match[1], jwtSecret())
  }
  catch {
    return null
  }
  return queryOne(`SELECT ${USER_COLUMNS} FROM users WHERE id = $1`, [Number(payload.sub)])
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
}

export function todayISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

<<<<<<< HEAD
/** Catch row + the related user, spot and species (what a SQL JOIN would return). */
export function expandCatch(row) {
  const user = db.users.find(u => u.id === row.user_id)
  const spot = db.spots.find(s => s.id === row.spot_id)
  const sp = db.species.find(s => s.id === row.species_id)
  return {
    ...row,
    user: user ? { id: user.id, full_name: user.full_name, username: user.username } : null,
    spot: spot ? { id: spot.id, name: spot.name, province: spot.province, water_type: spot.water_type } : null,
    species: sp ? { id: sp.id, common_name: sp.common_name, local_name: sp.local_name, is_protected: sp.is_protected, image_url: sp.image_url } : null,
  }
}

/** Spot row + computed counts used by list screens. */
export function spotSummary(spot) {
  const speciesIds = db.spotSpecies.filter(l => l.spot_id === spot.id).map(l => l.species_id)
  return {
    ...spot,
    species_ids: speciesIds,
    species_count: speciesIds.length,
    catch_count: db.catches.filter(c => c.spot_id === spot.id).length,
  }
}
=======
/** Catch row joined with its user, spot and species. Add WHERE / ORDER BY after it. */
export const CATCH_SELECT = `
  SELECT c.*,
         u.full_name AS u_full_name, u.username AS u_username,
         s.name AS s_name, s.province AS s_province, s.water_type AS s_water_type,
         sp.common_name AS sp_common_name, sp.local_name AS sp_local_name,
         sp.is_protected AS sp_is_protected, sp.image_url AS sp_image_url
  FROM catches c
  LEFT JOIN users u ON u.id = c.user_id
  LEFT JOIN fishing_spots s ON s.id = c.spot_id
  LEFT JOIN species sp ON sp.id = c.species_id`

/** Turns a CATCH_SELECT row into a catch with nested user, spot and species objects. */
export function toCatch(row) {
  const {
    u_full_name, u_username,
    s_name, s_province, s_water_type,
    sp_common_name, sp_local_name, sp_is_protected, sp_image_url,
    ...catchRow
  } = row
  return {
    ...catchRow,
    user: u_username ? { id: row.user_id, full_name: u_full_name, username: u_username } : null,
    spot: s_name ? { id: row.spot_id, name: s_name, province: s_province, water_type: s_water_type } : null,
    species: sp_common_name
      ? { id: row.species_id, common_name: sp_common_name, local_name: sp_local_name, is_protected: sp_is_protected, image_url: sp_image_url }
      : null,
  }
}

/** Spot row plus the species ids and counts used by list screens. Add WHERE / ORDER BY after it. */
export const SPOT_SELECT = `
  SELECT s.*,
         ARRAY(SELECT ss.species_id FROM spot_species ss WHERE ss.spot_id = s.id ORDER BY ss.species_id) AS species_ids,
         (SELECT COUNT(*)::int FROM spot_species ss WHERE ss.spot_id = s.id) AS species_count,
         (SELECT COUNT(*)::int FROM catches c WHERE c.spot_id = s.id) AS catch_count
  FROM fishing_spots s`
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
