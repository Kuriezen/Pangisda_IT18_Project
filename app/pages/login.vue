<script setup>
definePageMeta({ middleware: 'guest' })
useHead({ title: 'Log in' })

const auth = useAuthStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()

const form = reactive({ email: '', password: '' })
const errors = ref({})
const attempted = ref(false)
const submitting = ref(false)
const serverMessage = ref('')
const showPassword = ref(false)

watch(form, () => { if (attempted.value) errors.value = validateLogin(form) }, { deep: true })

function fillDemo(account) {
  form.email = account.email
  form.password = account.password
}

async function submit() {
  attempted.value = true
  serverMessage.value = ''
  errors.value = validateLogin(form)
  if (Object.keys(errors.value).length) return focusFirstError(errors.value)

  submitting.value = true
  try {
    const user = await auth.login(form)
    ui.notify(`Welcome back, ${user.full_name.split(' ')[0]}!`)
    const redirect = typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/') ? route.query.redirect : '/'
    router.push(redirect)
  }
  catch (e) {
    serverMessage.value = e.message
    if (e.details) errors.value = { ...e.details }
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container auth-wrap">
    <div class="card auth-card">
      <div class="card-body">
        <h1>Log in</h1>
        <p class="muted">Welcome back! Log in to record your catches and manage your saved spots.</p>

        <form class="form" novalidate @submit.prevent="submit">
          <FormErrorSummary v-if="attempted && (Object.keys(errors).length || serverMessage)" :errors="errors" :labels="{ email: 'Email', password: 'Password' }" :message="serverMessage" />
          <BaseInput id="email" v-model="form.email" type="email" label="Email" autocomplete="email" :error="errors.email" required />
          <div class="pw-field">
            <BaseInput id="password" v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Password" autocomplete="current-password" :error="errors.password" required />
            <button type="button" class="btn btn-ghost btn-sm pw-toggle" :aria-pressed="showPassword ? 'true' : 'false'" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}<span class="sr-only"> password</span>
            </button>
          </div>
          <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
            <span v-if="submitting" class="spinner" aria-hidden="true" />
            {{ submitting ? 'Logging in…' : 'Log in' }}
          </button>
        </form>

        <p class="switch small">No account yet? <NuxtLink to="/register">Create one</NuxtLink></p>

        <div class="demo">
          <p class="small"><strong>Demo accounts (mock API)</strong></p>
          <div class="demo-buttons">
            <button v-for="acc in DEMO_ACCOUNTS" :key="acc.email" type="button" class="btn btn-outline btn-sm" @click="fillDemo(acc)">
              Use {{ acc.label }} account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap { padding-top: var(--space-6); display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 460px; }
.auth-card h1 { margin-bottom: var(--space-2); }
.pw-field { position: relative; }
.pw-toggle { position: absolute; right: 4px; top: 30px; min-height: 38px; }
.switch { text-align: center; margin: var(--space-4) 0 0; }
.demo { margin-top: var(--space-5); padding: var(--space-4); background: var(--c-surface-2); border-radius: var(--radius-sm); }
.demo p { margin-bottom: var(--space-2); }
.demo-buttons { display: flex; flex-wrap: wrap; gap: var(--space-2); }
</style>
