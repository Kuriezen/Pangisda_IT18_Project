/**
 * Server-side validation for the mock API. The real backend will apply the
 * same rules; the client validates first for fast feedback, but the server
 * never trusts the client.
 */
import { FISHING_METHODS, WATER_TYPES } from '../data/db.js'
import { todayISO } from './api.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateCatchPayload(body) {
  const e = {}
  if (!Number.isInteger(Number(body.spot_id)) || Number(body.spot_id) <= 0) e.spot_id = 'A valid fishing spot is required.'
  if (!Number.isInteger(Number(body.species_id)) || Number(body.species_id) <= 0) e.species_id = 'A valid species is required.'

  const w = Number(body.weight_kg)
  if (body.weight_kg === undefined || body.weight_kg === null || body.weight_kg === '' || Number.isNaN(w) || w <= 0 || w > 500) {
    e.weight_kg = 'Weight must be greater than 0 and at most 500 kg.'
  }
  if (body.length_cm !== undefined && body.length_cm !== null && body.length_cm !== '') {
    const l = Number(body.length_cm)
    if (Number.isNaN(l) || l < 1 || l > 400) e.length_cm = 'Length must be between 1 and 400 cm.'
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body.caught_at || ''))) e.caught_at = 'Date caught must use the YYYY-MM-DD format.'
  else if (body.caught_at > todayISO()) e.caught_at = 'Date caught cannot be in the future.'

  if (!FISHING_METHODS.includes(body.method)) e.method = 'Unknown fishing method.'
  if (body.bait && String(body.bait).length > 60) e.bait = 'Bait must be 60 characters or fewer.'
  if (body.notes && String(body.notes).length > 500) e.notes = 'Notes must be 500 characters or fewer.'
  return e
}

export function validateSpotPayload(body) {
  const e = {}
  const name = String(body.name || '').trim()
  if (name.length < 3 || name.length > 80) e.name = 'Name must be 3 to 80 characters.'
  if (!String(body.municipality || '').trim()) e.municipality = 'Municipality is required.'
  if (!String(body.province || '').trim()) e.province = 'Province is required.'
  if (!WATER_TYPES.includes(body.water_type)) e.water_type = 'Water type must be saltwater, freshwater or brackish.'
  const lat = Number(body.latitude)
  const lng = Number(body.longitude)
  if (body.latitude === '' || Number.isNaN(lat) || lat < 4 || lat > 22) e.latitude = 'Latitude must be within the Philippines (4 to 22).'
  if (body.longitude === '' || Number.isNaN(lng) || lng < 116 || lng > 127) e.longitude = 'Longitude must be within the Philippines (116 to 127).'
  const desc = String(body.description || '').trim()
  if (desc.length < 20) e.description = 'Description must be at least 20 characters.'
  return e
}

export function validateRegisterPayload(body) {
  const e = {}
  const fullName = String(body.full_name || '').trim()
  if (fullName.length < 2 || fullName.length > 60) e.full_name = 'Full name must be 2 to 60 characters.'
  if (!/^[a-z0-9_]{3,20}$/.test(String(body.username || ''))) e.username = 'Username must be 3 to 20 lowercase letters, numbers or underscores.'
  if (!EMAIL_RE.test(String(body.email || ''))) e.email = 'Enter a valid email address.'
  const pw = String(body.password || '')
  if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) e.password = 'Password must be at least 8 characters with a letter and a number.'
  return e
}
