// POST /api/auth/register — public (new accounts always get the "angler" role)
<<<<<<< HEAD
import { db, nextId } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
=======
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  const body = (await readBody(event)) || {}
  const payload = {
    full_name: String(body.full_name || '').trim(),
    username: String(body.username || '').trim().toLowerCase(),
    email: String(body.email || '').trim().toLowerCase(),
    password: String(body.password || ''),
  }

  const details = validateRegisterPayload(payload)
  if (Object.keys(details).length) {
    return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)
  }
<<<<<<< HEAD
  if (db.users.some(u => u.email === payload.email)) {
    return apiFail(event, 409, 'EMAIL_TAKEN', 'An account with this email already exists.', { email: 'This email is already registered.' })
  }
  if (db.users.some(u => u.username === payload.username)) {
    return apiFail(event, 409, 'USERNAME_TAKEN', 'This username is already taken.', { username: 'This username is already taken.' })
  }

  const user = { id: nextId(db.users), ...payload, role: 'angler', created_at: new Date().toISOString() }
  db.users.push(user)
  setResponseStatus(event, 201)
  return apiOk({ token: makeMockToken(user), user: publicUser(user) })
=======
  const taken = await query('SELECT email, username FROM users WHERE email = $1 OR username = $2', [payload.email, payload.username])
  if (taken.some(u => u.email === payload.email)) {
    return apiFail(event, 409, 'EMAIL_TAKEN', 'An account with this email already exists.', { email: 'This email is already registered.' })
  }
  if (taken.some(u => u.username === payload.username)) {
    return apiFail(event, 409, 'USERNAME_TAKEN', 'This username is already taken.', { username: 'This username is already taken.' })
  }

  const passwordHash = await bcrypt.hash(payload.password, 10)
  const user = await queryOne(
    `INSERT INTO users (full_name, username, email, password_hash, role)
     VALUES ($1, $2, $3, $4, 'angler')
     RETURNING ${USER_COLUMNS}`,
    [payload.full_name, payload.username, payload.email, passwordHash],
  )
  setResponseStatus(event, 201)
  return apiOk({ token: makeToken(user), user })
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
})
