// POST /api/auth/login — public
<<<<<<< HEAD
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
=======
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
  const body = (await readBody(event)) || {}
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const details = {}
  if (!email) details.email = 'Email is required.'
  if (!password) details.password = 'Password is required.'
  if (Object.keys(details).length) {
    return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)
  }

<<<<<<< HEAD
  const user = db.users.find(u => u.email === email)
  if (!user || user.password !== password) {
    return apiFail(event, 401, 'INVALID_CREDENTIALS', 'Incorrect email or password.')
  }
  return apiOk({ token: makeMockToken(user), user: publicUser(user) })
=======
  const row = await queryOne(`SELECT ${USER_COLUMNS}, password_hash FROM users WHERE email = $1`, [email])
  if (!row || !(await bcrypt.compare(password, row.password_hash))) {
    return apiFail(event, 401, 'INVALID_CREDENTIALS', 'Incorrect email or password.')
  }
  const { password_hash, ...user } = row
  return apiOk({ token: makeToken(user), user })
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
})
