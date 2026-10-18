// GET /api/catches/:id — public
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const row = Number.isInteger(id) ? await queryOne(`${CATCH_SELECT} WHERE c.id = $1`, [id]) : null
  if (!row) return apiFail(event, 404, 'CATCH_NOT_FOUND', 'Catch not found.')
  return apiOk(toCatch(row))
})
