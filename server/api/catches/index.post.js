// POST /api/catches — logged-in users (angler or admin)
import { db, nextId } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay(450)
  const user = getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to log a catch.')

  const body = (await readBody(event)) || {}
  const details = validateCatchPayload(body)
  if (!details.spot_id && !db.spots.some(s => s.id === Number(body.spot_id))) details.spot_id = 'This fishing spot does not exist.'
  if (!details.species_id && !db.species.some(s => s.id === Number(body.species_id))) details.species_id = 'This species does not exist.'
  if (Object.keys(details).length) {
    return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)
  }

  const row = {
    id: nextId(db.catches),
    user_id: user.id,
    spot_id: Number(body.spot_id),
    species_id: Number(body.species_id),
    weight_kg: Math.round(Number(body.weight_kg) * 100) / 100,
    length_cm: body.length_cm === '' || body.length_cm == null ? null : Math.round(Number(body.length_cm) * 10) / 10,
    caught_at: body.caught_at,
    method: body.method,
    bait: String(body.bait || '').trim() || null,
    released: Boolean(body.released),
    notes: String(body.notes || '').trim() || null,
    created_at: new Date().toISOString(),
  }
  db.catches.push(row)
  setResponseStatus(event, 201)
  return apiOk(expandCatch(row))
})
