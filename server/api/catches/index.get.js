// GET /api/catches?spot_id=&user_id=&species_id= — public (newest first)
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const { spot_id, user_id, species_id } = getQuery(event)
  let list = db.catches
  if (spot_id) list = list.filter(c => c.spot_id === Number(spot_id))
  if (user_id) list = list.filter(c => c.user_id === Number(user_id))
  if (species_id) list = list.filter(c => c.species_id === Number(species_id))

  const data = [...list]
    .sort((a, b) => (b.caught_at.localeCompare(a.caught_at)) || (b.id - a.id))
    .map(expandCatch)
  return apiOk(data, { total: data.length })
})
