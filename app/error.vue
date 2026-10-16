<script setup>
const props = defineProps({ error: { type: Object, required: true } })
const is404 = computed(() => Number(props.error?.statusCode) === 404)
useHead({ title: is404 ? 'Page not found' : 'Error' })
</script>

<template>
  <NuxtLayout>
    <div class="container error-page">
      <EmptyState
        :icon="is404 ? 'compass' : 'alert'"
        :title="is404 ? 'This spot is off the map' : 'Something went wrong'"
        :message="is404 ? 'The page you are looking for does not exist or was moved.' : (error?.message || 'An unexpected error occurred.')"
      >
        <button type="button" class="btn btn-primary" @click="clearError({ redirect: '/' })">
          <AppIcon name="arrow-left" /> Back to home
        </button>
      </EmptyState>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.error-page { padding-top: var(--space-8); }
</style>
