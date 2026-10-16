<script setup>
defineProps({
  title: { type: String, required: true },
  message: { type: String, default: '' },
  icon: { type: String, default: 'fish' },
})
</script>

<template>
  <div class="card empty">
    <span class="empty-icon"><AppIcon :name="icon" /></span>
    <h3>{{ title }}</h3>
    <p v-if="message" class="muted">{{ message }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty { text-align: center; padding: var(--space-7) var(--space-5); display: flex; flex-direction: column; align-items: center; }
.empty-icon { display: grid; place-items: center; width: 64px; height: 64px; border-radius: 50%; background: var(--c-primary-soft); color: var(--c-primary); margin-bottom: var(--space-4); }
.empty-icon svg { width: 30px; height: 30px; }
.empty p { max-width: 44ch; }
</style>
