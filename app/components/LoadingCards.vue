<script setup>
defineProps({
  count: { type: Number, default: 3 },
  height: { type: Number, default: 260 },
  label: { type: String, default: 'Loading…' },
})
</script>
/**
 * LoadingCards component displays a grid of skeleton cards to indicate loading state.
 * The number of cards and their height can be customized via props.
 * The label prop provides an accessible description for screen readers.
 */
<template>
  <div class="grid grid-3" role="status" aria-live="polite">
    <span class="sr-only">{{ label }}</span>
    <div v-for="n in count" :key="n" class="skeleton" :style="{ height: `${height}px` }" aria-hidden="true" />
  </div>
</template>
