// GET /api/spots/:id — public
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const id = Number(getRouterParam(event, 'id'))
  const spot = db.spots.find(s => s.id === id)
  if (!spot) return apiFail(event, 404, 'SPOT_NOT_FOUND', `Fishing spot #${getRouterParam(event, 'id')} was not found.`)

  const speciesIds = db.spotSpecies.filter(l => l.spot_id === id).map(l => l.species_id)
  const creator = db.users.find(u => u.id === spot.created_by)
  return apiOk({
    ...spotSummary(spot),
    species: db.species.filter(sp => speciesIds.includes(sp.id)),
    creator: creator ? { id: creator.id, full_name: creator.full_name } : null,
  })
})
