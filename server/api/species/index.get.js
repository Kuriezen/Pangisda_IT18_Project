// GET /api/species — public
export default defineEventHandler(async () => {
  const list = await query('SELECT * FROM species ORDER BY local_name')
  return apiOk(list, { total: list.length })
})
