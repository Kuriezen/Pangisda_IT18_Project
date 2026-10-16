<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: '' },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div class="card stat-tile">
    <div class="stat-top">
      <span class="stat-label">{{ label }}</span>
      <span v-if="icon" class="stat-icon"><AppIcon :name="icon" /></span>
    </div>
    <p class="stat-value">{{ value }}</p>
    <p v-if="hint" class="stat-hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.stat-tile { padding: var(--space-4); }
.stat-top { display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); }
.stat-label { font-size: var(--fs-xs); font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--c-muted); }
.stat-icon { display: grid; place-items: center; width: 32px; height: 32px; border-radius: 9px; background: var(--c-primary-soft); color: var(--c-primary); }
.stat-icon svg { width: 18px; height: 18px; }
.stat-value { font-size: 1.75rem; font-weight: 800; margin: var(--space-2) 0 0; line-height: 1.1; color: var(--c-text); }
.stat-hint { font-size: var(--fs-xs); color: var(--c-muted); margin: var(--space-1) 0 0; }
</style>
