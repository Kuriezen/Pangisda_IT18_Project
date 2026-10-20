// GET /api/catches?spot_id=&user_id=&species_id= — public (newest first)
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
  return apiOk(data, { total: data.length })
})
