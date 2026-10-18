// GET /api/catches?spot_id=&user_id=&species_id= — public (newest first)
<<<<<<< HEAD
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
=======
export default defineEventHandler(async (event) => {
  const { spot_id, user_id, species_id } = getQuery(event)
  const where = []
  const params = []
  for (const [column, value] of [['c.spot_id', spot_id], ['c.user_id', user_id], ['c.species_id', species_id]]) {
    if (value) {
      params.push(Number(value) || 0)
      where.push(`${column} = $${params.length}`)
    }
  }

  const rows = await query(
    `${CATCH_SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY c.caught_at DESC, c.id DESC`,
    params,
  )
  const data = rows.map(toCatch)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  return apiOk(data, { total: data.length })
})
