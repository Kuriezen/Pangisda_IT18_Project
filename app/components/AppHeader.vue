<script setup>
const auth = useAuthStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
watch(() => route.fullPath, () => { menuOpen.value = false })

// Navigation changes depending on the user's role.
const links = computed(() => {
  const list = [
    { to: '/', label: 'Home' },
    { to: '/spots', label: 'Fishing Spots' },
    { to: '/catches', label: 'Catch Feed' },
  ]
  if (auth.isLoggedIn) list.push({ to: '/my-catches', label: 'My Catches' })
  if (auth.isAdmin) list.push({ to: '/admin/spots', label: 'Manage Spots' })
  return list
})

function logout() {
  auth.logout()
  ui.notify('You have been logged out.', 'info')
  router.push('/')
}

function onKeydown(e) {
  if (e.key === 'Escape' && menuOpen.value) menuOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink to="/" class="brand" aria-label="Pangisda home">
        <span class="brand-mark"><AppIcon name="fish" /></span>
        <span class="brand-name">Pangisda</span>
      </NuxtLink>

      <button
        type="button"
        class="btn btn-ghost btn-icon menu-toggle"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="primary-nav"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <AppIcon :name="menuOpen ? 'close' : 'menu'" />
      </button>

      <div id="primary-nav" class="nav-panel" :class="{ open: menuOpen }">
        <nav aria-label="Primary">
          <ul class="nav-links">
            <li v-for="link in links" :key="link.to">
              <NuxtLink :to="link.to" class="nav-link">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="nav-actions">
          <template v-if="auth.isLoggedIn">
            <NuxtLink to="/catches/new" class="btn btn-accent btn-sm">
              <AppIcon name="plus" /> Log a catch
            </NuxtLink>
            <span class="user-chip" :title="auth.user.email">
              <AppIcon name="user" />
              <span>{{ auth.firstName }}</span>
              <span v-if="auth.isAdmin" class="badge badge-admin">Admin</span>
            </span>
            <button type="button" class="btn btn-outline btn-sm" @click="logout">
              <AppIcon name="logout" /> Log out
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn btn-outline btn-sm">Log in</NuxtLink>
            <NuxtLink to="/register" class="btn btn-primary btn-sm">Sign up</NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky; top: 0; z-index: 50;
  background: rgb(246 243 236 / 0.92);
  backdrop-filter: saturate(1.4) blur(10px);
  border-bottom: 1px solid var(--c-border);
}
.header-inner { display: flex; align-items: center; gap: var(--space-4); min-height: var(--header-h); flex-wrap: wrap; }
.brand { display: inline-flex; align-items: center; gap: var(--space-2); text-decoration: none; color: var(--c-primary); margin-right: auto; }
.brand-mark { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; background: var(--c-primary); color: #f6f3ec; }
.brand-mark svg { width: 22px; height: 22px; }
.brand-name { font-weight: 800; font-size: 1.2rem; letter-spacing: -0.02em; }

.nav-panel { display: none; width: 100%; padding: var(--space-2) 0 var(--space-4); }
.nav-panel.open { display: block; }
.nav-links { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.nav-link {
  display: block; padding: var(--space-3) var(--space-3); border-radius: var(--radius-sm);
  color: var(--c-text); text-decoration: none; font-weight: 600; font-size: var(--fs-sm);
}
.nav-link:hover { background: var(--c-surface-2); color: var(--c-text); }
.nav-link.router-link-exact-active { background: var(--c-primary-soft); color: var(--c-primary); }
.nav-actions { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-2); margin-top: var(--space-3); padding-top: var(--space-3); border-top: 1px solid var(--c-border); }
.user-chip { display: inline-flex; align-items: center; gap: 6px; font-size: var(--fs-sm); font-weight: 650; padding: 0 var(--space-2); }
.user-chip svg { width: 18px; height: 18px; color: var(--c-muted); }

@media (min-width: 1024px) {
  .menu-toggle { display: none; }
  .header-inner { flex-wrap: nowrap; }
  .brand { margin-right: var(--space-4); }
  .nav-panel, .nav-panel.open { display: flex; align-items: center; justify-content: space-between; flex: 1; width: auto; padding: 0; }
  .nav-links { flex-direction: row; gap: var(--space-1); }
  .nav-link { padding: var(--space-2) var(--space-3); }
  .nav-actions { margin: 0; padding: 0; border: 0; flex-wrap: nowrap; }
}
</style>
