/**
 * Auth store — the logged-in user, their token and role.
 * Saved in cookies so the session survives a page refresh.
 */
export const useAuthStore = defineStore('auth', () => {
  const cookieOptions = { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' }
  const token = useCookie('pangisda_token', cookieOptions)
  const user = useCookie('pangisda_user', cookieOptions)

  const isLoggedIn = computed(() => Boolean(token.value && user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')
  const firstName = computed(() => user.value?.full_name?.split(' ')[0] || '')

  function setSession(data) {
    token.value = data.token
    user.value = data.user
  }

  async function login(credentials) {
    const api = useApi()
    const res = await api.post('/auth/login', {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    })
    setSession(res.data)
    return res.data.user
  }

  async function register(form) {
    const api = useApi()
    const res = await api.post('/auth/register', {
      full_name: form.full_name.trim(),
      username: form.username.trim().toLowerCase(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    })
    setSession(res.data)
    return res.data.user
  }

  function logout() {
    token.value = null
    user.value = null
  }

  return { token, user, isLoggedIn, isAdmin, firstName, login, register, logout }
})
