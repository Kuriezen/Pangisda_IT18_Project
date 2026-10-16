<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  canDelete: { type: Boolean, default: false },
  deleting: { type: Boolean, default: false },
  showSpot: { type: Boolean, default: true },
})
defineEmits(['delete'])

const initials = computed(() => (props.item.user?.full_name || '?').split(' ').map(p => p[0]).slice(0, 2).join(''))
</script>

<template>
  <article class="card catch-card">
    <img
      v-if="item.species?.image_url"
      :src="item.species.image_url"
      :alt="`Photo of a ${item.species.common_name.toLowerCase()} (${item.species.local_name})`"
      class="catch-photo"
      loading="lazy"
    >
    <div class="card-body">
      <header class="catch-head">
        <span class="avatar" aria-hidden="true">{{ initials }}</span>
        <div class="catch-who">
          <p class="catch-angler">{{ item.user?.full_name }}</p>
          <p class="catch-date"><AppIcon name="calendar" /> <time :datetime="item.caught_at">{{ formatDate(item.caught_at) }}</time></p>
        </div>
        <span v-if="item.released" class="badge badge-success"><AppIcon name="leaf" /> Released</span>
      </header>

      <h3 class="catch-title">
        {{ item.species?.local_name }}
        <span class="muted catch-common">· {{ item.species?.common_name }}</span>
      </h3>

      <dl class="catch-facts">
        <div><dt><AppIcon name="scale" /> Weight</dt><dd>{{ formatWeight(item.weight_kg) }}</dd></div>
        <div><dt><AppIcon name="ruler" /> Length</dt><dd>{{ item.length_cm ? `${item.length_cm} cm` : '—' }}</dd></div>
        <div><dt><AppIcon name="hook" /> Method</dt><dd>{{ methodLabel(item.method) }}</dd></div>
      </dl>

      <p v-if="showSpot && item.spot" class="catch-spot">
        <AppIcon name="pin" />
        <NuxtLink :to="`/spots/${item.spot.id}`">{{ item.spot.name }}</NuxtLink>
        <span class="muted">· {{ item.spot.province }}</span>
      </p>
      <p v-if="item.bait" class="small muted catch-bait">Bait: {{ item.bait }}</p>
      <p v-if="item.notes" class="catch-notes">“{{ item.notes }}”</p>

      <div v-if="canDelete" class="catch-actions">
        <button type="button" class="btn btn-danger btn-sm" :disabled="deleting" @click="$emit('delete', item)">
          <span v-if="deleting" class="spinner" aria-hidden="true" />
          <AppIcon v-else name="trash" />
          {{ deleting ? 'Deleting…' : 'Delete' }}
          <span class="sr-only">catch of {{ item.species?.local_name }} on {{ formatDate(item.caught_at) }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.catch-card { height: 100%; overflow: hidden; }
.catch-photo { display: block; width: 100%; aspect-ratio: 16 / 9; object-fit: cover; background: var(--c-surface-2); }
.catch-head { display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3); }
.avatar { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--c-teal-soft); color: #0b5a53; font-weight: 800; font-size: var(--fs-sm); flex: none; }
.catch-who { flex: 1; min-width: 0; }
.catch-angler { margin: 0; font-weight: 700; font-size: var(--fs-sm); }
.catch-date { margin: 0; display: flex; align-items: center; gap: 4px; font-size: var(--fs-xs); color: var(--c-muted); }
.catch-date svg { width: 14px; height: 14px; }
.catch-title { font-size: var(--fs-lg); margin-bottom: var(--space-3); }
.catch-common { font-weight: 500; font-size: var(--fs-sm); }
.catch-facts { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-2); margin: 0 0 var(--space-3); padding: var(--space-3); background: var(--c-surface-2); border-radius: var(--radius-sm); }
.catch-facts dt { display: flex; align-items: center; gap: 4px; font-size: var(--fs-xs); color: var(--c-muted); font-weight: 600; }
.catch-facts dt svg { width: 14px; height: 14px; }
.catch-facts dd { margin: 2px 0 0; font-weight: 700; font-size: var(--fs-sm); }
.catch-spot { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; font-size: var(--fs-sm); margin-bottom: var(--space-2); }
.catch-spot svg { width: 16px; height: 16px; color: var(--c-muted); }
.catch-spot a { font-weight: 650; }
.catch-bait { margin-bottom: var(--space-2); }
.catch-notes { font-style: italic; color: var(--c-muted); font-size: var(--fs-sm); margin: 0; }
.catch-actions { margin-top: var(--space-4); display: flex; justify-content: flex-end; }
</style>
