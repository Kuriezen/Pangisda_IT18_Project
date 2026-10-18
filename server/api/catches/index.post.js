// POST /api/catches — logged-in users (angler or admin)
<<<<<<< HEAD
import { db, nextId } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay(450)
  const user = getAuthUser(event)
=======
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to log a catch.')

  const body = (await readBody(event)) || {}
  const details = validateCatchPayload(body)
<<<<<<< HEAD
  if (!details.spot_id && !db.spots.some(s => s.id === Number(body.spot_id))) details.spot_id = 'This fishing spot does not exist.'
  if (!details.species_id && !db.species.some(s => s.id === Number(body.species_id))) details.species_id = 'This species does not exist.'
=======
  if (!details.spot_id && !(await queryOne('SELECT 1 FROM fishing_spots WHERE id = $1', [Number(body.spot_id)]))) {
    details.spot_id = 'This fishing spot does not exist.'
  }
  if (!details.species_id && !(await queryOne('SELECT 1 FROM species WHERE id = $1', [Number(body.species_id)]))) {
    details.species_id = 'This species does not exist.'
  }
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  if (Object.keys(details).length) {
    return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)
  }

<<<<<<< HEAD
  const row = {
    id: nextId(db.catches),
    user_id: user.id,
    spot_id: Number(body.spot_id),
    species_id: Number(body.species_id),
    weight_kg: Math.round(Number(body.weight_kg) * 100) / 100,
    length_cm: body.length_cm === '' || body.length_cm == null ? null : Math.round(Number(body.length_cm) * 10) / 10,
    caught_at: body.caught_at,
    method: body.method,
    bait: String(body.bait || '').trim() || null,
    released: Boolean(body.released),
    notes: String(body.notes || '').trim() || null,
    created_at: new Date().toISOString(),
  }
  db.catches.push(row)
  setResponseStatus(event, 201)
  return apiOk(expandCatch(row))
=======
  const inserted = await queryOne(
    `INSERT INTO catches (user_id, spot_id, species_id, weight_kg, length_cm, caught_at, method, bait, released, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id`,
    [
      user.id,
      Number(body.spot_id),
      Number(body.species_id),
      Math.round(Number(body.weight_kg) * 100) / 100,
      body.length_cm === '' || body.length_cm == null ? null : Math.round(Number(body.length_cm) * 10) / 10,
      body.caught_at,
      body.method,
      String(body.bait || '').trim() || null,
      Boolean(body.released),
      String(body.notes || '').trim() || null,
    ],
  )
  const row = await queryOne(`${CATCH_SELECT} WHERE c.id = $1`, [inserted.id])
  setResponseStatus(event, 201)
  return apiOk(toCatch(row))
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
})
