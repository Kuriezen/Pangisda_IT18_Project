// GET /api/stats/summary — public (numbers for the home page)
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
  })
})
