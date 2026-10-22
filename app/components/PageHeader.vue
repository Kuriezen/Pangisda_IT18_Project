<script setup>
defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>
/**
 * Page header component for consistent page titles and actions.
 * Eyebrow is a small text above the title, often used for context.
 * Subtitle is a smaller text below the title, often used for description.
 * Actions slot is for buttons or links related to the page.
 */
<template>
  <div class="page-header">
    <div class="page-header-row">
      <div>
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h1>{{ title }}</h1>
        <p v-if="subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="page-header-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
