<script setup>
defineProps({
  title: { type: String, required: true },
  eyebrow: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

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
