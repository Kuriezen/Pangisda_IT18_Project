/**
 * Helpers shared by the mock API routes (auto-imported by Nuxt in /server).
 *
 * Every response follows the same envelope that the real backend will use:
 *   success → { success: true, data, meta? }
 *   error   → { success: false, error: { code, message, details? } }
 */
import { db } from '../data/db.js'

export function apiOk(data, meta) {
  return meta ? { success: true, data, meta } : { success: true, data }
}

export function apiFail(event, status, code, message, details) {
  setResponseStatus(event, status)
  const error = { code, message }
  if (details && Object.keys(details).length) error.details = details
  return { success: false, error }
}

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
}

export function todayISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

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
