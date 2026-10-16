<script setup>
const route = useRoute()
const api = useApi()
const spots = useSpotsStore()
const catches = useCatchesStore()
const ui = useUiStore()

const spotId = computed(() => Number(route.params.id))
const spot = ref(null)
const loading = ref(true)
const error = ref('')
const notFound = ref(false)

useHead({ title: computed(() => (spot.value ? spot.value.name : 'Fishing spot')) })

async function load() {
  loading.value = true
  error.value = ''
  notFound.value = false
  try {
    const res = await api.get(`/spots/${spotId.value}`)
    spot.value = res.data
  }
  catch (e) {
    if (e.status === 404) notFound.value = true
    else error.value = e.message
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
  catches.fetchAll()
})
watch(spotId, load)

const spotCatches = computed(() => catches.bySpot(spotId.value))
const saved = computed(() => spots.isFavorite(spotId.value))
const mapUrl = computed(() => spot.value ? `https://www.google.com/maps?q=${spot.value.latitude},${spot.value.longitude}` : '#')

function toggleSave() {
  const nowSaved = spots.toggleFavorite(spotId.value)
  ui.notify(nowSaved ? 'Spot saved.' : 'Spot removed from saved spots.', 'info', 2500)
}
</script>

<template>
  <div class="container">
    <NuxtLink to="/spots" class="btn btn-ghost btn-sm back-link"><AppIcon name="arrow-left" /> All spots</NuxtLink>

    <div v-if="loading" role="status" aria-live="polite">
      <span class="sr-only">Loading spot…</span>
      <div class="skeleton" style="height: 220px" />
      <div class="skeleton" style="height: 160px; margin-top: 16px" />
    </div>

    <EmptyState v-else-if="notFound" icon="compass" title="Spot not found" message="This fishing spot does not exist or was removed by an administrator.">
      <NuxtLink to="/spots" class="btn btn-primary">Browse spots</NuxtLink>
    </EmptyState>

    <ErrorState v-else-if="error" :message="error" @retry="load" />

    <article v-else-if="spot">
      <SpotCover :water-type="spot.water_type" size="hero" />

      <header class="detail-head">
        <div>
          <WaterBadge :type="spot.water_type" />
          <h1>{{ spot.name }}</h1>
          <p class="detail-loc"><AppIcon name="pin" /> {{ spot.municipality }}, {{ spot.province }}</p>
        </div>
        <div class="detail-actions">
          <button type="button" class="btn btn-outline" :aria-pressed="saved ? 'true' : 'false'" @click="toggleSave">
            <AppIcon name="heart" :class="{ filled: saved }" /> {{ saved ? 'Saved' : 'Save spot' }}
          </button>
          <NuxtLink :to="{ path: '/catches/new', query: { spot: spot.id } }" class="btn btn-accent">
            <AppIcon name="plus" /> Log a catch here
          </NuxtLink>
        </div>
      </header>

      <div class="detail-grid">
        <div class="stack">
          <section class="card card-body" aria-labelledby="about-heading">
            <h2 id="about-heading">About this spot</h2>
            <p>{{ spot.description }}</p>
            <dl class="facts">
              <div><dt><AppIcon name="clock" /> Best time</dt><dd>{{ spot.best_time || 'Not specified' }}</dd></div>
              <div><dt><AppIcon name="compass" /> Access</dt><dd>{{ accessLabel(spot.access_level) }}</dd></div>
              <div><dt><AppIcon name="fish" /> Catches logged</dt><dd>{{ spotCatches.length }}</dd></div>
              <div>
                <dt><AppIcon name="pin" /> Coordinates</dt>
                <dd>
                  {{ spot.latitude.toFixed(4) }}, {{ spot.longitude.toFixed(4) }}
                  <a :href="mapUrl" target="_blank" rel="noopener noreferrer" class="map-link">
                    Open map <AppIcon name="external" /><span class="sr-only">(opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="spot-catches-heading">
            <h2 id="spot-catches-heading" class="section-title">Catches at {{ spot.name }}</h2>
            <LoadingCards v-if="catches.loading && !catches.items.length" :count="2" label="Loading catches…" />
            <div v-else-if="spotCatches.length" class="grid grid-2">
              <CatchCard v-for="c in spotCatches" :key="c.id" :item="c" :show-spot="false" />
            </div>
            <EmptyState v-else title="No catches logged yet" message="Be the first to log a catch at this spot." />
          </section>
        </div>

        <aside class="card card-body species-panel" aria-labelledby="species-heading">
          <h2 id="species-heading">Species found here</h2>
          <ul class="species-list">
            <li v-for="sp in spot.species" :key="sp.id">
              <img v-if="sp.image_url" :src="sp.image_url" :alt="`Photo of a ${sp.common_name.toLowerCase()}`" class="sp-photo" loading="lazy">
              <div class="sp-info">
                <p class="sp-name">{{ sp.local_name }}</p>
                <p class="sp-sci small muted">{{ sp.common_name }} · <em>{{ sp.scientific_name }}</em></p>
                <p v-if="sp.conservation_note" class="sp-note small">{{ sp.conservation_note }}</p>
                <p v-if="sp.image_credit" class="sp-credit muted">Photo: {{ sp.image_credit }}</p>
              </div>
              <span v-if="sp.is_protected" class="badge badge-warning"><AppIcon name="shield" /> Protected</span>
            </li>
          </ul>
        </aside>
      </div>
    </article>
  </div>
</template>

<style scoped>
.back-link { margin: var(--space-5) 0 var(--space-4); }
.detail-head { display: flex; flex-wrap: wrap; gap: var(--space-4); justify-content: space-between; align-items: flex-end; margin: var(--space-5) 0; }
.detail-head h1 { margin: var(--space-2) 0 var(--space-1); }
.detail-loc { display: flex; align-items: center; gap: 6px; color: var(--c-muted); margin: 0; }
.detail-loc svg { width: 18px; height: 18px; }
.detail-actions { display: flex; flex-wrap: wrap; gap: var(--space-2); }
.filled { fill: currentColor; color: var(--c-accent); }
.detail-grid { display: grid; gap: var(--space-5); }
@media (min-width: 1024px) { .detail-grid { grid-template-columns: 2fr 1fr; align-items: start; } }
.facts { display: grid; gap: var(--space-3); grid-template-columns: 1fr; margin: 0; }
@media (min-width: 640px) { .facts { grid-template-columns: 1fr 1fr; } }
.facts > div { padding: var(--space-3); background: var(--c-surface-2); border-radius: var(--radius-sm); }
.facts dt { display: flex; align-items: center; gap: 6px; font-size: var(--fs-xs); font-weight: 650; color: var(--c-muted); text-transform: uppercase; letter-spacing: .04em; }
.facts dt svg { width: 15px; height: 15px; }
.facts dd { margin: 4px 0 0; font-weight: 650; }
.map-link { display: inline-flex; align-items: center; gap: 3px; margin-left: 6px; font-size: var(--fs-sm); font-weight: 600; }
.map-link svg { width: 14px; height: 14px; }
.section-title { margin-top: var(--space-6); }
.species-list { list-style: none; margin: 0; padding: 0; }
.species-list li { display: flex; justify-content: space-between; gap: var(--space-3); padding: var(--space-3) 0; border-top: 1px solid var(--c-border); }
.species-list li:first-child { border-top: 0; padding-top: 0; }
.sp-photo { width: 72px; height: 54px; object-fit: cover; border-radius: var(--radius-sm); flex: none; background: var(--c-surface-2); }
.sp-info { flex: 1; min-width: 0; }
.sp-credit { margin: var(--space-1) 0 0; font-size: var(--fs-xs); }
.sp-name { margin: 0; font-weight: 700; }
.sp-sci { margin: 0; }
.sp-note { margin: var(--space-1) 0 0; color: var(--c-warning); }
.species-list .badge { align-self: flex-start; flex: none; }
@media (min-width: 1024px) { .species-panel { position: sticky; top: calc(var(--header-h) + 16px); } }
</style>
