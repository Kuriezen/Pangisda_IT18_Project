// PUT /api/spots/:id — admin only
<<<<<<< HEAD
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const user = getAuthUser(event)
=======
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can edit fishing spots.')

  const id = Number(getRouterParam(event, 'id'))
<<<<<<< HEAD
  const spot = db.spots.find(s => s.id === id)
=======
  const spot = Number.isInteger(id) ? await queryOne('SELECT * FROM fishing_spots WHERE id = $1', [id]) : null
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  if (!spot) return apiFail(event, 404, 'SPOT_NOT_FOUND', 'Fishing spot not found.')

  const body = { ...spot, ...((await readBody(event)) || {}) }
  const details = validateSpotPayload(body)
  if (Object.keys(details).length) return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)

<<<<<<< HEAD
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
=======
  await query(
    `UPDATE fishing_spots
     SET name = $1, municipality = $2, province = $3, water_type = $4, latitude = $5,
         longitude = $6, best_time = $7, access_level = $8, description = $9
     WHERE id = $10`,
    [
      String(body.name).trim(),
      String(body.municipality).trim(),
      String(body.province).trim(),
      body.water_type,
      Number(body.latitude),
      Number(body.longitude),
      String(body.best_time || '').trim() || null,
      ['easy', 'moderate', 'hard'].includes(body.access_level) ? body.access_level : spot.access_level,
      String(body.description).trim(),
      id,
    ],
  )
  return apiOk(await queryOne(`${SPOT_SELECT} WHERE s.id = $1`, [id]))
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
})
