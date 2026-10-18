// POST /api/auth/register — public (new accounts always get the "angler" role)
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
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
})
