/**
 * Creates one configured fetch client ($api) for the whole app.
 * - baseURL comes from runtimeConfig.public.apiBase (this project's own /api by default)
 * - the auth token from the Pinia auth store is attached to every request
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const auth = useAuthStore(nuxtApp.$pinia)
      if (auth.token) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${auth.token}`)
        options.headers = headers
      }
    },
  })

  return { provide: { api } }
})
