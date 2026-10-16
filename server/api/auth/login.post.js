// POST /api/auth/login — public
import { db } from '../../data/db.js'

export default defineEventHandler(async (event) => {
  await mockDelay()
  const body = (await readBody(event)) || {}
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')

  const details = {}
  if (!email) details.email = 'Email is required.'
  if (!password) details.password = 'Password is required.'
  if (Object.keys(details).length) {
    return apiFail(event, 422, 'VALIDATION_ERROR', 'Please check the highlighted fields.', details)
  }

  const user = db.users.find(u => u.email === email)
  if (!user || user.password !== password) {
    return apiFail(event, 401, 'INVALID_CREDENTIALS', 'Incorrect email or password.')
  }
  return apiOk({ token: makeMockToken(user), user: publicUser(user) })
})
