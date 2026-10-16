<script setup>
defineProps({
  count: { type: Number, default: 3 },
  height: { type: Number, default: 260 },
  label: { type: String, default: 'Loading…' },
})
</script>

<template>
  <div class="grid grid-3" role="status" aria-live="polite">
    <span class="sr-only">{{ label }}</span>
    <div v-for="n in count" :key="n" class="skeleton" :style="{ height: `${height}px` }" aria-hidden="true" />
  </div>
</template>
