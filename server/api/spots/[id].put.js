// PUT /api/spots/:id — admin only
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const user = getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can edit fishing spots.')

  const id = Number(getRouterParam(event, 'id'))
  const spot = db.spots.find(s => s.id === id)
  if (!spot) return apiFail(event, 404, 'SPOT_NOT_FOUND', 'Fishing spot not found.')

  const body = { ...spot, ...((await readBody(event)) || {}) }
  const details = validateSpotPayload(body)
  if (Object.keys(details).length) return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)

  Object.assign(spot, {
    name: String(body.name).trim(),
    municipality: String(body.municipality).trim(),
    province: String(body.province).trim(),
    water_type: body.water_type,
    latitude: Number(body.latitude),
    longitude: Number(body.longitude),
    best_time: String(body.best_time || '').trim() || null,
    access_level: ['easy', 'moderate', 'hard'].includes(body.access_level) ? body.access_level : spot.access_level,
    description: String(body.description).trim(),
  })
  return apiOk(spotSummary(spot))
})
