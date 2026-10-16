<script setup>
defineProps({ message: { type: String, required: true } })
defineEmits(['retry'])
</script>

<template>
  <div class="alert alert-error error-state" role="alert">
    <AppIcon name="alert" />
    <div class="error-body">
      <p><strong>Something went wrong.</strong> {{ message }}</p>
      <button type="button" class="btn btn-outline btn-sm" @click="$emit('retry')">Try again</button>
    </div>
  </div>
</template>

<style scoped>
.error-state { padding: var(--space-4) var(--space-5); }
.error-body { display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; justify-content: space-between; flex: 1; }
</style>
