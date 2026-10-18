// DELETE /api/spots/:id — admin only. Refused while catches still reference the spot
<<<<<<< HEAD
// (mirrors ON DELETE RESTRICT on catches.spot_id in the database design).
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const user = getAuthUser(event)
=======
// (catches.spot_id is ON DELETE RESTRICT; spot_species rows are removed by ON DELETE CASCADE).
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can delete fishing spots.')

  const id = Number(getRouterParam(event, 'id'))
<<<<<<< HEAD
  const index = db.spots.findIndex(s => s.id === id)
  if (index === -1) return apiFail(event, 404, 'SPOT_NOT_FOUND', 'Fishing spot not found.')

  const used = db.catches.filter(c => c.spot_id === id).length
=======
  const spot = Number.isInteger(id) ? await queryOne(`${SPOT_SELECT} WHERE s.id = $1`, [id]) : null
  if (!spot) return apiFail(event, 404, 'SPOT_NOT_FOUND', 'Fishing spot not found.')

  const used = spot.catch_count
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  if (used) {
    return apiFail(event, 409, 'SPOT_IN_USE', `This spot has ${used} logged catch${used === 1 ? '' : 'es'} and cannot be deleted.`)
  }

<<<<<<< HEAD
  db.spots.splice(index, 1)
  for (let i = db.spotSpecies.length - 1; i >= 0; i--) {
    if (db.spotSpecies[i].spot_id === id) db.spotSpecies.splice(i, 1)
  }
=======
  await query('DELETE FROM fishing_spots WHERE id = $1', [id])
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  return apiOk({ id })
})
