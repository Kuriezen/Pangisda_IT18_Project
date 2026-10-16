<script setup>
/** Accessible select with label, placeholder option, hint and error message. */
defineOptions({ inheritAttrs: false })

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, required: true },
  modelValue: { type: [String, Number], default: '' },
  options: { type: Array, required: true }, // [{ value, label }]
  placeholder: { type: String, default: '' },
  error: { type: String, default: '' },
  hint: { type: String, default: '' },
  required: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const describedBy = computed(() => (props.error ? `${props.id}-error` : props.hint ? `${props.id}-hint` : undefined))
</script>

<template>
  <div class="field" :class="{ 'has-error': error }">
    <label :for="id" class="field-label">
      {{ label }} <span v-if="required" class="req" aria-hidden="true">*</span>
    </label>
    <select
      :id="id"
      v-model="model"
      class="input"
      v-bind="$attrs"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-required="required ? 'true' : undefined"
      :aria-describedby="describedBy"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" :id="`${id}-error`" class="field-error"><AppIcon name="alert" /> {{ error }}</p>
    <p v-else-if="hint" :id="`${id}-hint`" class="field-hint">{{ hint }}</p>
  </div>
</template>
