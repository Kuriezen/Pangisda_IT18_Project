// PUT /api/spots/:id — admin only
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can edit fishing spots.')

  const id = Number(getRouterParam(event, 'id'))
  const spot = Number.isInteger(id) ? await queryOne('SELECT * FROM fishing_spots WHERE id = $1', [id]) : null
  if (!spot) return apiFail(event, 404, 'SPOT_NOT_FOUND', 'Fishing spot not found.')

  const body = { ...spot, ...((await readBody(event)) || {}) }
  const details = validateSpotPayload(body)
  if (Object.keys(details).length) return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)

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
})
