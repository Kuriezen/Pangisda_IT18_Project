<script setup>
/**
 * Lists every form error at the top of the form (WCAG "error identification").
 * Each item links to its field so keyboard users can jump straight to it.
 */
defineProps({
  errors: { type: Object, required: true },
  labels: { type: Object, default: () => ({}) },
  message: { type: String, default: '' },
})
</script>

<template>
  <div v-if="message || Object.keys(errors).length" class="alert alert-error" role="alert">
    <AppIcon name="alert" />
    <div>
      <p><strong>{{ message || 'Please fix the following:' }}</strong></p>
      <ul v-if="Object.keys(errors).length">
        <li v-for="(msg, field) in errors" :key="field">
          <a :href="`#${field}`">{{ labels[field] ? `${labels[field]}: ` : '' }}{{ msg }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
