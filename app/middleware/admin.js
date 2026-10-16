// Pages with `definePageMeta({ middleware: 'admin' })` are only for the admin role.
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (!auth.isAdmin) {
    useUiStore().notify('That page is for administrators only.', 'error')
    return navigateTo('/')
  }
})
