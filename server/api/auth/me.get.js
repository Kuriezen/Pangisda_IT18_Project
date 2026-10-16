// GET /api/auth/me — logged-in users
export default defineEventHandler(async (event) => {
  const user = getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  return apiOk(publicUser(user))
})
