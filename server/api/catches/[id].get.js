// GET /api/catches/:id — public
<<<<<<< HEAD
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const id = Number(getRouterParam(event, 'id'))
  const row = db.catches.find(c => c.id === id)
  if (!row) return apiFail(event, 404, 'CATCH_NOT_FOUND', 'Catch not found.')
  return apiOk(expandCatch(row))
=======
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const row = Number.isInteger(id) ? await queryOne(`${CATCH_SELECT} WHERE c.id = $1`, [id]) : null
  if (!row) return apiFail(event, 404, 'CATCH_NOT_FOUND', 'Catch not found.')
  return apiOk(toCatch(row))
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
})
