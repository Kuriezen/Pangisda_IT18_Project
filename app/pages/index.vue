<script setup>
useHead({ title: 'Home' })

const api = useApi()
const auth = useAuthStore()
const spots = useSpotsStore()
const catches = useCatchesStore()

const stats = ref(null)
const statsError = ref('')

async function loadStats() {
  statsError.value = ''
  try {
    const res = await api.get('/stats/summary')
    stats.value = res.data
  }
  catch (e) {
    statsError.value = e.message
  }
}

onMounted(() => {
  spots.fetchAll()
  catches.fetchAll()
  loadStats()
})

const featured = computed(() => [...spots.items].sort((a, b) => b.catch_count - a.catch_count).slice(0, 3))
const recent = computed(() => catches.items.slice(0, 3))
</script>

<template>
  <div>
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-copy">
          <span class="hero-eyebrow"><AppIcon name="wave" /> Para sa mga mangingisda</span>
          <h1>Find your spot.<br>Log your catch.</h1>
          <p>
            Pangisda helps anglers around Butuan discover fishing spots, record every catch,
            and practice responsible catch-and-release.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/spots" class="btn btn-accent">
              <AppIcon name="search" /> Explore spots
            </NuxtLink>
            <NuxtLink v-if="auth.isLoggedIn" to="/catches/new" class="btn btn-light">
              <AppIcon name="plus" /> Log a catch
            </NuxtLink>
            <NuxtLink v-else to="/register" class="btn btn-light">Create a free account</NuxtLink>
          </div>
        </div>
        <svg class="hero-art" viewBox="0 0 320 220" aria-hidden="true">
          <circle cx="250" cy="52" r="26" fill="#f6c76b" opacity=".9" />
          <path d="M0 120c40-16 80-16 120 0s80 16 120 0 80-16 80-16v116H0Z" fill="rgb(255 255 255 / .10)" />
          <path d="M0 150c45-14 90-14 135 0s90 14 135 0 50-10 50-10v80H0Z" fill="rgb(255 255 255 / .14)" />
          <path d="M150 20v95" stroke="#f6f3ec" stroke-width="2" opacity=".7" />
          <path d="M150 115a10 10 0 1 1-10 10" fill="none" stroke="#f6f3ec" stroke-width="3" stroke-linecap="round" />
          <g transform="translate(70 168)" fill="none" stroke="#f6f3ec" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
            <path d="M0 12c10-12 22-17 36-17 9 0 16 7 21 17-5 10-12 17-21 17C22 29 10 24 0 12Zm0 0-7-10M0 12l-7 10" />
          </g>
        </svg>
      </div>
    </section>

    <div class="container">
      <section class="section stats-section" aria-labelledby="stats-heading">
        <h2 id="stats-heading" class="sr-only">Community numbers</h2>
        <ErrorState v-if="statsError" :message="statsError" @retry="loadStats" />
        <div v-else class="stats-row">
          <StatTile label="Fishing spots" :value="stats ? stats.total_spots : '–'" icon="pin" />
          <StatTile label="Catches logged" :value="stats ? stats.total_catches : '–'" icon="fish" />
          <StatTile label="Species" :value="stats ? stats.total_species : '–'" icon="hook" />
          <StatTile label="Released" :value="stats ? `${stats.release_rate}%` : '–'" icon="leaf" hint="of all catches" />
        </div>
      </section>

      <section class="section" aria-labelledby="featured-heading">
        <div class="section-head">
          <h2 id="featured-heading">Popular spots</h2>
          <NuxtLink to="/spots" class="btn btn-ghost btn-sm">View all spots <AppIcon name="arrow-right" /></NuxtLink>
        </div>
        <ErrorState v-if="spots.error" :message="spots.error" @retry="spots.fetchAll({ force: true })" />
        <LoadingCards v-else-if="spots.loading && !spots.items.length" label="Loading spots…" />
        <div v-else class="grid grid-3">
          <SpotCard v-for="spot in featured" :key="spot.id" :spot="spot" />
        </div>
      </section>

      <section class="section" aria-labelledby="recent-heading">
        <div class="section-head">
          <h2 id="recent-heading">Latest catches</h2>
          <NuxtLink to="/catches" class="btn btn-ghost btn-sm">Open the catch feed <AppIcon name="arrow-right" /></NuxtLink>
        </div>
        <ErrorState v-if="catches.error" :message="catches.error" @retry="catches.fetchAll({ force: true })" />
        <LoadingCards v-else-if="catches.loading && !catches.items.length" label="Loading catches…" />
        <div v-else class="grid grid-3">
          <CatchCard v-for="c in recent" :key="c.id" :item="c" />
        </div>
      </section>

      <section class="section">
        <div class="card care">
          <span class="care-icon"><AppIcon name="leaf" /></span>
          <div>
            <h2>Fish today, fish tomorrow</h2>
            <p>
              Some species, like the <strong>mameng</strong> (humphead wrasse) of Butuan Bay, are endangered.
              Pangisda marks protected species and reminds you to release them.
              Respect closed seasons, marine sanctuaries and minimum sizes.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.hero { background: linear-gradient(150deg, #0b4f6c 0%, #0f766e 100%); color: #f6f3ec; overflow: hidden; }
.hero-inner { display: grid; gap: var(--space-5); align-items: center; padding-top: var(--space-7); padding-bottom: var(--space-7); }
@media (min-width: 768px) { .hero-inner { grid-template-columns: 1.2fr 1fr; padding-top: var(--space-8); padding-bottom: var(--space-8); } }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 6px; font-size: var(--fs-sm); font-weight: 650; padding: 4px 12px; border-radius: 999px; background: rgb(255 255 255 / .12); margin-bottom: var(--space-4); }
.hero-eyebrow svg { width: 16px; height: 16px; }
.hero h1 { font-size: var(--fs-3xl); color: #fff; letter-spacing: -0.03em; margin-bottom: var(--space-4); }
.hero p { font-size: var(--fs-lg); color: #d9ece9; max-width: 48ch; }
.hero-actions { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-top: var(--space-5); }
.btn-light { background: #fff; color: var(--c-primary); }
.btn-light:hover { background: #e9f1f4; color: var(--c-primary-hover); }
.hero-art { width: 100%; max-width: 380px; justify-self: center; display: none; }
@media (min-width: 768px) { .hero-art { display: block; } }
.stats-section { margin-top: calc(var(--space-6) * -1); position: relative; }
.care { display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-5); background: var(--c-teal-soft); border-color: #b9e0da; }
@media (min-width: 640px) { .care { flex-direction: row; align-items: flex-start; padding: var(--space-6); } }
.care-icon { display: grid; place-items: center; width: 52px; height: 52px; border-radius: 14px; background: var(--c-teal); color: #fff; flex: none; }
.care-icon svg { width: 26px; height: 26px; }
.care p { margin: 0; max-width: 70ch; }
</style>
