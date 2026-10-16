// GET /api/spots?q=&water_type=&province= — public
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
  return apiOk(data, { total: data.length })
})
