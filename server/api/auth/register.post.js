// POST /api/auth/register — public (new accounts always get the "angler" role)
import { db, nextId } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
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
})
