<script setup>
/**
 * Accessible text input / textarea with label, hint and error message.
 * The error is linked to the input with aria-describedby so screen readers read it.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  as: { type: String, default: 'input' }, // 'input' | 'textarea'
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
  optional: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

const describedBy = computed(() => {
  if (props.error) return `${props.id}-error`
  if (props.hint) return `${props.id}-hint`
  return undefined
})
</script>

<template>
  <div class="field" :class="{ 'has-error': error }">
    <label :for="id" class="field-label">
      {{ label }}
      <span v-if="required" class="req" aria-hidden="true">*</span>
      <span v-else-if="optional" class="optional">(optional)</span>
    </label>
    <textarea
      v-if="as === 'textarea'"
      :id="id"
      v-model="model"
      class="input"
      v-bind="$attrs"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-required="required ? 'true' : undefined"
      :aria-describedby="describedBy"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      class="input"
      v-bind="$attrs"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-required="required ? 'true' : undefined"
      :aria-describedby="describedBy"
    >
    <p v-if="error" :id="`${id}-error`" class="field-error"><AppIcon name="alert" /> {{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field-hint">{{ hint }}</p>
  </div>
</template>
