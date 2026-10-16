<script setup>
const props = defineProps({
  spot: { type: Object, required: true },
})
const spots = useSpotsStore()
const ui = useUiStore()

const saved = computed(() => spots.isFavorite(props.spot.id))

function toggle() {
  const nowSaved = spots.toggleFavorite(props.spot.id)
  ui.notify(nowSaved ? `${props.spot.name} saved to your spots.` : `${props.spot.name} removed from your spots.`, 'info', 2500)
}
</script>

<template>
  <article class="card spot-card">
    <SpotCover :water-type="spot.water_type" />
    <button
      type="button"
      class="fav-btn"
      :class="{ saved }"
      :aria-pressed="saved ? 'true' : 'false'"
      :aria-label="saved ? `Remove ${spot.name} from saved spots` : `Save ${spot.name}`"
      @click="toggle"
    >
      <AppIcon name="heart" />
    </button>
    <div class="card-body">
      <WaterBadge :type="spot.water_type" />
      <h3 class="spot-title">
        <NuxtLink :to="`/spots/${spot.id}`" class="stretched">{{ spot.name }}</NuxtLink>
      </h3>
      <p class="spot-loc"><AppIcon name="pin" /> {{ spot.municipality }}, {{ spot.province }}</p>
      <ul class="spot-meta">
        <li><strong>{{ spot.species_count }}</strong> species</li>
        <li><strong>{{ spot.catch_count }}</strong> {{ spot.catch_count === 1 ? 'catch' : 'catches' }} logged</li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.spot-card { position: relative; overflow: hidden; transition: box-shadow .2s, transform .2s; }
.spot-card:hover { box-shadow: var(--shadow); transform: translateY(-2px); }
.spot-title { margin: var(--space-3) 0 var(--space-1); }
.stretched { color: var(--c-text); text-decoration: none; }
.stretched::after { content: ''; position: absolute; inset: 0; z-index: 1; }
.stretched:hover { color: var(--c-primary); }
.stretched:focus-visible { box-shadow: none; }
.spot-card:has(.stretched:focus-visible) { box-shadow: var(--focus); }
.spot-loc { display: flex; align-items: center; gap: 6px; color: var(--c-muted); font-size: var(--fs-sm); margin-bottom: var(--space-3); }
.spot-loc svg { width: 16px; height: 16px; }
.spot-meta { list-style: none; margin: 0; padding: var(--space-3) 0 0; border-top: 1px dashed var(--c-border); display: flex; gap: var(--space-4); font-size: var(--fs-sm); color: var(--c-muted); }
.spot-meta strong { color: var(--c-text); }
.fav-btn {
  position: absolute; top: 12px; left: 12px; z-index: 2;
  display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%;
  border: 0; background: rgb(255 255 255 / .92); color: var(--c-muted); cursor: pointer;
  box-shadow: var(--shadow-sm);
}
.fav-btn svg { width: 20px; height: 20px; }
.fav-btn:hover { color: var(--c-accent); }
.fav-btn.saved { color: var(--c-accent); }
.fav-btn.saved svg { fill: currentColor; }
</style>
