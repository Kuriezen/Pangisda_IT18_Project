// POST /api/spots — admin only
import { db, nextId } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const user = getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can add fishing spots.')

  const body = (await readBody(event)) || {}
  const details = validateSpotPayload(body)
  if (Object.keys(details).length) return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)

  const spot = {
    id: nextId(db.spots),
    name: String(body.name).trim(),
    municipality: String(body.municipality).trim(),
    province: String(body.province).trim(),
    water_type: body.water_type,
    latitude: Number(body.latitude),
    longitude: Number(body.longitude),
    best_time: String(body.best_time || '').trim() || null,
    access_level: ['easy', 'moderate', 'hard'].includes(body.access_level) ? body.access_level : 'moderate',
    description: String(body.description).trim(),
    created_by: user.id,
    created_at: new Date().toISOString(),
  }
  db.spots.push(spot)
  setResponseStatus(event, 201)
  return apiOk(spotSummary(spot))
})
