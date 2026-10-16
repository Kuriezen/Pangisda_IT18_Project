// GET /api/catches/:id — public
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const id = Number(getRouterParam(event, 'id'))
  const row = db.catches.find(c => c.id === id)
  if (!row) return apiFail(event, 404, 'CATCH_NOT_FOUND', 'Catch not found.')
  return apiOk(expandCatch(row))
})
