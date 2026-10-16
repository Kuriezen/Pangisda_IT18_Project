<script setup>
/**
 * Decorative cover illustration for a spot. Colors depend on the water type,
 * so no copyrighted photos are needed.
 */
const props = defineProps({
  waterType: { type: String, default: 'saltwater' },
  size: { type: String, default: 'card' }, // 'card' | 'hero'
})
const gradient = computed(() => {
  const map = {
    saltwater: ['var(--water-salt-1)', 'var(--water-salt-2)'],
    freshwater: ['var(--water-fresh-1)', 'var(--water-fresh-2)'],
    brackish: ['var(--water-brackish-1)', 'var(--water-brackish-2)'],
  }
  const [a, b] = map[props.waterType] || map.saltwater
  return `linear-gradient(160deg, ${b} 0%, ${a} 100%)`
})
</script>

<template>
  <div class="spot-cover" :class="`spot-cover-${size}`" :style="{ background: gradient }" aria-hidden="true">
    <svg class="waves" viewBox="0 0 400 120" preserveAspectRatio="none">
      <path d="M0 70c40-18 80-18 120 0s80 18 120 0 80-18 120 0 40 9 40 9v41H0Z" fill="rgb(255 255 255 / .10)" />
      <path d="M0 88c45-14 90-14 135 0s90 14 135 0 90-14 130 0v32H0Z" fill="rgb(255 255 255 / .14)" />
    </svg>
    <svg class="fish-mark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 12c3.5-4.5 7.5-6.5 12-6.5 3 0 5.5 2.5 7 6.5-1.5 4-4 6.5-7 6.5-4.5 0-8.5-2-12-6.5Z" />
      <path d="M3 12 1 8m2 4-2 4" />
    </svg>
  </div>
</template>

<style scoped>
.spot-cover { position: relative; overflow: hidden; color: rgb(255 255 255 / .35); }
.spot-cover-card { height: 120px; }
.spot-cover-hero { height: 180px; border-radius: var(--radius-lg); }
@media (min-width: 768px) { .spot-cover-hero { height: 220px; } }
.waves { position: absolute; inset: auto 0 0 0; width: 100%; height: 70%; }
.fish-mark { position: absolute; right: 18px; top: 16px; width: 56px; height: 56px; }
.spot-cover-hero .fish-mark { width: 90px; height: 90px; right: 32px; top: 28px; }
</style>
