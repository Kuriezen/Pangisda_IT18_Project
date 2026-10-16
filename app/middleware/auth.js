// Pages with `definePageMeta({ middleware: 'auth' })` require a logged-in user.
export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn) {
    useUiStore().notify('Please log in first.', 'info')
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
