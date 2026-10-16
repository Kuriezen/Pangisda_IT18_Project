<script setup>
definePageMeta({ middleware: 'guest' })
useHead({ title: 'Create account' })

const auth = useAuthStore()
const ui = useUiStore()
const router = useRouter()

const form = reactive({ full_name: '', username: '', email: '', password: '', confirm_password: '', agree: false })
const LABELS = { full_name: 'Full name', username: 'Username', email: 'Email', password: 'Password', confirm_password: 'Confirm password', agree: 'Privacy notice' }
const errors = ref({})
const attempted = ref(false)
const submitting = ref(false)
const serverMessage = ref('')

watch(form, () => { if (attempted.value) errors.value = validateRegister(form) }, { deep: true })

async function submit() {
  attempted.value = true
  serverMessage.value = ''
  errors.value = validateRegister(form)
  if (Object.keys(errors.value).length) return focusFirstError(errors.value)

  submitting.value = true
  try {
    const user = await auth.register(form)
    ui.notify(`Account created. Welcome, ${user.full_name.split(' ')[0]}!`)
    router.push('/spots')
  }
  catch (e) {
    serverMessage.value = e.message
    if (e.details) {
      errors.value = { ...e.details }
      focusFirstError(errors.value)
    }
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
        <h1>Create an account</h1>
        <p class="muted">Join the community to log catches and save your favorite spots.</p>

        <form class="form" novalidate @submit.prevent="submit">
          <FormErrorSummary v-if="attempted && (Object.keys(errors).length || serverMessage)" :errors="errors" :labels="LABELS" :message="serverMessage" />
          <BaseInput id="full_name" v-model="form.full_name" label="Full name" autocomplete="name" :error="errors.full_name" required />
          <BaseInput id="username" v-model="form.username" label="Username" autocomplete="username" hint="3–20 lowercase letters, numbers or underscores" :error="errors.username" required />
          <BaseInput id="email" v-model="form.email" type="email" label="Email" autocomplete="email" :error="errors.email" required />
          <div class="form-row">
            <BaseInput id="password" v-model="form.password" type="password" label="Password" autocomplete="new-password" hint="At least 8 characters with a letter and a number" :error="errors.password" required />
            <BaseInput id="confirm_password" v-model="form.confirm_password" type="password" label="Confirm password" autocomplete="new-password" :error="errors.confirm_password" required />
          </div>
          <div class="field" :class="{ 'has-error': errors.agree }">
            <label class="checkbox">
              <input id="agree" v-model="form.agree" type="checkbox" :aria-invalid="errors.agree ? 'true' : 'false'" :aria-describedby="errors.agree ? 'agree-error' : undefined">
              <span>
                I agree that Pangisda will store my name, email and catch records to run this service,
                in line with the Data Privacy Act of 2012 (RA 10173). My email is never shown publicly.
              </span>
            </label>
            <p v-if="errors.agree" id="agree-error" class="field-error"><AppIcon name="alert" /> {{ errors.agree }}</p>
          </div>
          <button type="submit" class="btn btn-primary btn-block" :disabled="submitting">
            <span v-if="submitting" class="spinner" aria-hidden="true" />
            {{ submitting ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <p class="switch small">Already have an account? <NuxtLink to="/login">Log in</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrap { padding-top: var(--space-6); display: flex; justify-content: center; }
.auth-card { width: 100%; max-width: 560px; }
.auth-card h1 { margin-bottom: var(--space-2); }
.switch { text-align: center; margin: var(--space-4) 0 0; }
</style>
