// GET /api/spots/:id — public
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
})
