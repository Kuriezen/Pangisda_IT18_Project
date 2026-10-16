// DELETE /api/spots/:id — admin only. Refused while catches still reference the spot
// (mirrors ON DELETE RESTRICT on catches.spot_id in the database design).
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const user = getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  if (user.role !== 'admin') return apiFail(event, 403, 'FORBIDDEN', 'Only administrators can delete fishing spots.')

  const id = Number(getRouterParam(event, 'id'))
  const index = db.spots.findIndex(s => s.id === id)
  if (index === -1) return apiFail(event, 404, 'SPOT_NOT_FOUND', 'Fishing spot not found.')

  const used = db.catches.filter(c => c.spot_id === id).length
  if (used) {
    return apiFail(event, 409, 'SPOT_IN_USE', `This spot has ${used} logged catch${used === 1 ? '' : 'es'} and cannot be deleted.`)
  }

  db.spots.splice(index, 1)
  for (let i = db.spotSpecies.length - 1; i >= 0; i--) {
    if (db.spotSpecies[i].spot_id === id) db.spotSpecies.splice(i, 1)
  }
  return apiOk({ id })
})
