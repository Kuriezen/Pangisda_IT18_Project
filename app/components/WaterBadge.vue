<script setup>
defineProps({ type: { type: String, required: true } })
</script>

<template>
  <span class="badge" :class="`badge-${type}`">
    <AppIcon name="wave" /> {{ waterLabel(type) }}
  </span>
</template>
