// GET /api/auth/me — logged-in users
export default defineEventHandler(async (event) => {
<<<<<<< HEAD
  const user = getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  return apiOk(publicUser(user))
=======
  const user = await getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')
  return apiOk(user)
>>>>>>> 0ab77e949ae6b0e1c42383131831f1137337a888
})
