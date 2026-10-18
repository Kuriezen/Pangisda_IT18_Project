// GET /api/stats/summary — public (numbers for the home page)
<<<<<<< HEAD
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
=======
export default defineEventHandler(async () => {
  const row = await queryOne(`
    SELECT (SELECT COUNT(*)::int FROM fishing_spots) AS total_spots,
           (SELECT COUNT(*)::int FROM catches) AS total_catches,
           (SELECT COUNT(*)::int FROM catches WHERE released) AS released,
           (SELECT COUNT(*)::int FROM species) AS total_species,
           (SELECT COUNT(*)::int FROM users WHERE role = 'angler') AS total_anglers`)
  return apiOk({
    total_spots: row.total_spots,
    total_catches: row.total_catches,
    total_species: row.total_species,
    total_anglers: row.total_anglers,
    release_rate: row.total_catches ? Math.round((row.released / row.total_catches) * 100) : 0,
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  })
})
