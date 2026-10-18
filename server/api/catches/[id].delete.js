// DELETE /api/catches/:id — the angler who logged it, or an admin
export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  if (!user) return apiFail(event, 401, 'UNAUTHENTICATED', 'Please log in to continue.')

  const id = Number(getRouterParam(event, 'id'))
  const row = Number.isInteger(id) ? await queryOne('SELECT user_id FROM catches WHERE id = $1', [id]) : null
  if (!row) return apiFail(event, 404, 'CATCH_NOT_FOUND', 'Catch not found.')
  if (row.user_id !== user.id && user.role !== 'admin') {
    return apiFail(event, 403, 'FORBIDDEN', 'You can only delete your own catches.')
  }
  await query('DELETE FROM catches WHERE id = $1', [id])
  return apiOk({ id })
})
