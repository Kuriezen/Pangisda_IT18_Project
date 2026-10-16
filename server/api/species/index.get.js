// GET /api/species — public
import { db } from '../../data/db.js'

export default defineEventHandler(async () => {
  await mockDelay(150)
  const list = [...db.species].sort((a, b) => a.local_name.localeCompare(b.local_name))
  return apiOk(list, { total: list.length })
})
