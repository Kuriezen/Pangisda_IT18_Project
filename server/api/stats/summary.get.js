// GET /api/stats/summary — public (numbers for the home page)
import { db } from '../../data/db.js'

export default defineEventHandler(async () => {
  await mockDelay(200)
  const total = db.catches.length
  const released = db.catches.filter(c => c.released).length
  return apiOk({
    total_spots: db.spots.length,
    total_catches: total,
    total_species: db.species.length,
    total_anglers: db.users.filter(u => u.role === 'angler').length,
    release_rate: total ? Math.round((released / total) * 100) : 0,
  })
})
