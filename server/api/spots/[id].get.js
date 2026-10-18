// GET /api/spots/:id — public
<<<<<<< HEAD
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
=======
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const spot = Number.isInteger(id) ? await queryOne(`${SPOT_SELECT} WHERE s.id = $1`, [id]) : null
  if (!spot) return apiFail(event, 404, 'SPOT_NOT_FOUND', `Fishing spot #${getRouterParam(event, 'id')} was not found.`)

  const species = await query(
    `SELECT sp.* FROM species sp
     JOIN spot_species ss ON ss.species_id = sp.id
     WHERE ss.spot_id = $1
     ORDER BY sp.id`,
    [id],
  )
  const creator = spot.created_by ? await queryOne('SELECT id, full_name FROM users WHERE id = $1', [spot.created_by]) : null
  return apiOk({ ...spot, species, creator })
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
})
