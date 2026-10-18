// GET /api/spots?q=&water_type=&province= — public
<<<<<<< HEAD
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const { q, water_type, province } = getQuery(event)
  const term = String(q || '').trim().toLowerCase()

  let list = db.spots
  if (term) list = list.filter(s => `${s.name} ${s.municipality} ${s.province}`.toLowerCase().includes(term))
  if (water_type) list = list.filter(s => s.water_type === water_type)
  if (province) list = list.filter(s => s.province === province)

  const data = list.map(spotSummary).sort((a, b) => a.name.localeCompare(b.name))
=======
export default defineEventHandler(async (event) => {
  const { q, water_type, province } = getQuery(event)
  const term = String(q || '').trim()
  const where = []
  const params = []
  if (term) {
    params.push(`%${term}%`)
    where.push(`concat_ws(' ', s.name, s.municipality, s.province) ILIKE $${params.length}`)
  }
  if (water_type) {
    params.push(String(water_type))
    where.push(`s.water_type::text = $${params.length}`)
  }
  if (province) {
    params.push(String(province))
    where.push(`s.province = $${params.length}`)
  }

  const data = await query(`${SPOT_SELECT} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY s.name`, params)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  return apiOk(data, { total: data.length })
})
