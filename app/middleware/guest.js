// Login and register pages are only for visitors who are not logged in yet.
export default defineNuxtRouteMiddleware(() => {
  if (useAuthStore().isLoggedIn) return navigateTo('/')
})
