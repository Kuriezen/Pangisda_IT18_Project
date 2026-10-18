// GET /api/species — public
<<<<<<< HEAD
import { db } from '../../data/db.js'

export default defineEventHandler(async () => {
  await mockDelay(150)
  const list = [...db.species].sort((a, b) => a.local_name.localeCompare(b.local_name))
=======
export default defineEventHandler(async () => {
  const list = await query('SELECT * FROM species ORDER BY local_name')
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  return apiOk(list, { total: list.length })
})
