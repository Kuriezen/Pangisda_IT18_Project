<script setup>
definePageMeta({ middleware: 'auth' })
useHead({ title: 'My catches' })

const auth = useAuthStore()
const spots = useSpotsStore()
const catches = useCatchesStore()
const ui = useUiStore()

onMounted(() => {
  catches.fetchAll()
  spots.fetchAll()
})

const mine = computed(() => catches.byUser(auth.user?.id))
const stats = computed(() => catches.statsForUser(auth.user?.id))
const deletingId = ref(null)

async function removeCatch(item) {
  if (!window.confirm(`Delete your ${item.species?.local_name} catch from ${formatDate(item.caught_at)}? This cannot be undone.`)) return
  deletingId.value = item.id
  try {
    await catches.remove(item.id)
    ui.notify('Catch deleted.')
  }
  catch (e) {
    ui.notify(e.message, 'error')
  }
  finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="container">
    <PageHeader eyebrow="Your log" :title="`${auth.firstName}'s catches`" subtitle="Your personal catch history, stats and saved spots.">
      <template #actions>
        <NuxtLink to="/catches/new" class="btn btn-accent"><AppIcon name="plus" /> Log a catch</NuxtLink>
      </template>
    </PageHeader>

    <section aria-labelledby="my-stats-heading">
      <h2 id="my-stats-heading" class="sr-only">My statistics</h2>
      <div class="stats-row">
        <StatTile label="Catches" :value="stats.count" icon="fish" />
        <StatTile label="Total weight" :value="formatWeight(stats.totalWeight)" icon="scale" />
        <StatTile label="Personal best" :value="stats.best ? formatWeight(stats.best.weight_kg) : '–'" icon="hook" :hint="stats.best ? stats.best.species.local_name : 'No catches yet'" />
        <StatTile label="Released" :value="`${stats.releaseRate}%`" icon="leaf" :hint="`${stats.spotsVisited} spot${stats.spotsVisited === 1 ? '' : 's'} fished`" />
      </div>
    </section>

    <section class="section" aria-labelledby="my-list-heading">
      <div class="section-head"><h2 id="my-list-heading">Catch history</h2></div>
      <ErrorState v-if="catches.error" :message="catches.error" @retry="catches.fetchAll({ force: true })" />
      <LoadingCards v-else-if="catches.loading && !catches.items.length" :count="3" label="Loading your catches…" />
      <div v-else-if="mine.length" class="grid grid-3">
        <CatchCard v-for="c in mine" :key="c.id" :item="c" can-delete :deleting="deletingId === c.id" @delete="removeCatch" />
      </div>
      <EmptyState v-else title="No catches yet" message="Log your first catch and it will appear here.">
        <NuxtLink to="/catches/new" class="btn btn-accent"><AppIcon name="plus" /> Log a catch</NuxtLink>
      </EmptyState>
    </section>

    <section class="section" aria-labelledby="saved-heading">
      <div class="section-head"><h2 id="saved-heading">Saved spots</h2></div>
      <div v-if="spots.favorites.length" class="grid grid-3">
        <SpotCard v-for="spot in spots.favorites" :key="spot.id" :spot="spot" />
      </div>
      <EmptyState v-else icon="heart" title="No saved spots" message="Tap the heart on any fishing spot to save it here.">
        <NuxtLink to="/spots" class="btn btn-primary">Browse spots</NuxtLink>
      </EmptyState>
    </section>
  </div>
</template>
