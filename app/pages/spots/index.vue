<script setup>
useHead({ title: 'Fishing spots' })

const spots = useSpotsStore()
onMounted(() => spots.fetchAll())

const provinceOptions = computed(() => spots.provinces.map(p => ({ value: p, label: p })))
const hasFilters = computed(() => spots.filters.search || spots.filters.waterType || spots.filters.province)
</script>

<template>
  <div class="container">
    <PageHeader
      eyebrow="Explore"
      title="Fishing spots"
      subtitle="Lakes, rivers, reefs and mangrove channels around Butuan and the Agusan area. Filter by water type or province, then save the spots you want to try."
    />

    <form class="card toolbar" role="search" aria-label="Filter fishing spots" @submit.prevent>
      <div class="field">
        <label for="spot-search" class="field-label">Search</label>
        <div class="search-wrap">
          <AppIcon name="search" />
          <input id="spot-search" v-model="spots.filters.search" type="search" class="input" placeholder="Name, town or province" autocomplete="off">
        </div>
      </div>
      <BaseSelect id="spot-water" v-model="spots.filters.waterType" label="Water type" :options="WATER_TYPES" placeholder="All water types" />
      <BaseSelect id="spot-province" v-model="spots.filters.province" label="Province" :options="provinceOptions" placeholder="All provinces" />
      <button type="button" class="btn btn-outline" :disabled="!hasFilters" @click="spots.resetFilters()">Clear filters</button>
    </form>

    <ErrorState v-if="spots.error" :message="spots.error" @retry="spots.fetchAll({ force: true })" />
    <LoadingCards v-else-if="spots.loading && !spots.items.length" :count="6" label="Loading fishing spots…" />
    <template v-else>
      <p class="result-count" aria-live="polite">
        Showing {{ spots.filtered.length }} of {{ spots.items.length }} spots
      </p>
      <div v-if="spots.filtered.length" class="grid grid-3">
        <SpotCard v-for="spot in spots.filtered" :key="spot.id" :spot="spot" />
      </div>
      <EmptyState v-else icon="search" title="No spots match your filters" message="Try a different search term or clear the filters.">
        <button type="button" class="btn btn-primary" @click="spots.resetFilters()">Clear filters</button>
      </EmptyState>
    </template>
  </div>
</template>
