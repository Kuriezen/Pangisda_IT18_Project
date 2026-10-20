// GET /api/spots?q=&water_type=&province= — public
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
  return apiOk(data, { total: data.length })
})
