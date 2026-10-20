// POST /api/spots — admin only
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can add fishing spots.')

  const body = (await readBody(event)) || {}
  const details = validateSpotPayload(body)
  if (Object.keys(details).length) return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)

  const inserted = await queryOne(
    `INSERT INTO fishing_spots (name, municipality, province, water_type, latitude, longitude, best_time, access_level, description, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      String(body.name).trim(),
      String(body.municipality).trim(),
      String(body.province).trim(),
      body.water_type,
      Number(body.latitude),
      Number(body.longitude),
      String(body.best_time || '').trim() || null,
      ['easy', 'moderate', 'hard'].includes(body.access_level) ? body.access_level : 'moderate',
      String(body.description).trim(),
      user.id,
    ],
  )
  const spot = await queryOne(`${SPOT_SELECT} WHERE s.id = $1`, [inserted.id])
  setResponseStatus(event, 201)
  return apiOk(spot)
})
