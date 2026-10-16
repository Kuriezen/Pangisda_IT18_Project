<script setup>
useHead({ title: 'Catch feed' })

const auth = useAuthStore()
const spots = useSpotsStore()
const catches = useCatchesStore()

onMounted(() => {
  catches.fetchAll()
  spots.fetchAll()
})

const speciesOptions = computed(() => spots.species.map(s => ({ value: s.id, label: `${s.local_name} (${s.common_name})` })))
const sortOptions = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'heaviest', label: 'Heaviest first' },
]
const hasFilters = computed(() => catches.filters.speciesId || catches.filters.waterType || catches.filters.releasedOnly || catches.filters.sort !== 'newest')
</script>

<template>
  <div class="container">
    <PageHeader eyebrow="Community" title="Catch feed" subtitle="Every catch logged by the Pangisda community. Filter by species or water type, or show released fish only.">
      <template #actions>
        <NuxtLink :to="auth.isLoggedIn ? '/catches/new' : '/login'" class="btn btn-accent">
          <AppIcon name="plus" /> Log a catch
        </NuxtLink>
      </template>
    </PageHeader>

    <form class="card toolbar feed-toolbar" aria-label="Filter catches" @submit.prevent>
      <BaseSelect id="feed-species" v-model="catches.filters.speciesId" label="Species" :options="speciesOptions" placeholder="All species" />
      <BaseSelect id="feed-water" v-model="catches.filters.waterType" label="Water type" :options="WATER_TYPES" placeholder="All water types" />
      <BaseSelect id="feed-sort" v-model="catches.filters.sort" label="Sort by" :options="sortOptions" />
      <div class="feed-extra">
        <label class="checkbox">
          <input v-model="catches.filters.releasedOnly" type="checkbox">
          <span>Released only</span>
        </label>
        <button type="button" class="btn btn-outline btn-sm" :disabled="!hasFilters" @click="catches.resetFilters()">Reset</button>
      </div>
    </form>

    <ErrorState v-if="catches.error" :message="catches.error" @retry="catches.fetchAll({ force: true })" />
    <LoadingCards v-else-if="catches.loading && !catches.items.length" :count="6" label="Loading catches…" />
    <template v-else>
      <p class="result-count" aria-live="polite">
        {{ catches.filtered.length }} {{ catches.filtered.length === 1 ? 'catch' : 'catches' }} ·
        {{ catches.releaseRate }}% of all catches were released
      </p>
      <div v-if="catches.filtered.length" class="grid grid-3">
        <CatchCard v-for="c in catches.filtered" :key="c.id" :item="c" />
      </div>
      <EmptyState v-else title="No catches match these filters" message="Try another species or reset the filters.">
        <button type="button" class="btn btn-primary" @click="catches.resetFilters()">Reset filters</button>
      </EmptyState>
    </template>
  </div>
</template>

<style scoped>
@media (min-width: 1024px) { .feed-toolbar { grid-template-columns: 1.5fr 1fr 1fr auto; } }
.feed-extra { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4); min-height: 46px; }
</style>
