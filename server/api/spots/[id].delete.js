// DELETE /api/spots/:id — admin only. Refused while catches still reference the spot
// (catches.spot_id is ON DELETE RESTRICT; spot_species rows are removed by ON DELETE CASCADE).
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can delete fishing spots.')

  const id = Number(getRouterParam(event, 'id'))
  const spot = Number.isInteger(id) ? await queryOne(`${SPOT_SELECT} WHERE s.id = $1`, [id]) : null
  if (!spot) return apiFail(event, 404, 'SPOT_NOT_FOUND', 'Fishing spot not found.')

  const used = spot.catch_count
  if (used) {
    return apiFail(event, 409, 'SPOT_IN_USE', `This spot has ${used} logged catch${used === 1 ? '' : 'es'} and cannot be deleted.`)
  }

  await query('DELETE FROM fishing_spots WHERE id = $1', [id])
  return apiOk({ id })
})
