<script setup>
/**
 * Log a catch — the main form of the midterm.
 * Validation: client-side rules (utils/validators.js) on submit and live after the
 * first attempt, plus server-side errors (422) mapped back onto the fields.
 */
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Log a catch' })

const route = useRoute()
const router = useRouter()
const spots = useSpotsStore()
const catches = useCatchesStore()
const ui = useUiStore()

const form = reactive({
  spot_id: route.query.spot ? Number(route.query.spot) : '',
  species_id: '',
  weight_kg: '',
  length_cm: '',
  caught_at: todayLocalISO(),
  method: 'rod_and_reel',
  bait: '',
  released: false,
  notes: '',
})

const LABELS = {
  spot_id: 'Fishing spot', species_id: 'Species', weight_kg: 'Weight', length_cm: 'Length',
  caught_at: 'Date caught', method: 'Method', bait: 'Bait', notes: 'Notes',
}

const errors = ref({})
const attempted = ref(false)
const submitting = ref(false)
const serverMessage = ref('')

onMounted(() => spots.fetchAll())

// After the first submit attempt, re-check the form as the user types.
watch(form, () => {
  if (attempted.value) errors.value = validateCatch(form)
}, { deep: true })

const spotOptions = computed(() => spots.items.map(s => ({ value: s.id, label: `${s.name} — ${s.province}` })))
const selectedSpot = computed(() => spots.getById(form.spot_id))

// Species known at the chosen spot are listed first.
const speciesOptions = computed(() => {
  const known = selectedSpot.value?.species_ids || []
  const list = [...spots.species].sort((a, b) => Number(known.includes(b.id)) - Number(known.includes(a.id)))
  return list.map(s => ({ value: s.id, label: `${s.local_name} (${s.common_name})${known.includes(s.id) ? ' • found here' : ''}` }))
})
const selectedSpecies = computed(() => spots.speciesById(form.species_id))
const showReleaseWarning = computed(() => selectedSpecies.value?.is_protected && !form.released)
const notesLeft = computed(() => 500 - (form.notes?.length || 0))

async function submit() {
  attempted.value = true
  serverMessage.value = ''
  errors.value = validateCatch(form)
  if (Object.keys(errors.value).length) {
    focusFirstError(errors.value)
    return
  }

  submitting.value = true
  try {
    const saved = await catches.create(form)
    ui.notify(`Catch logged: ${saved.species.local_name}, ${formatWeight(saved.weight_kg)}.`, 'success')
    router.push('/my-catches')
  }
  catch (e) {
    if (e.status === 401) {
      ui.notify('Your session has expired. Please log in again.', 'error')
      useAuthStore().logout()
      router.push({ path: '/login', query: { redirect: route.fullPath } })
      return
    }
    serverMessage.value = e.message
    if (e.details) {
      errors.value = { ...e.details }
      focusFirstError(errors.value)
    }
  }
  finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="container narrow">
    <PageHeader eyebrow="Catch log" title="Log a catch" subtitle="Record what you caught, where and how. Fields marked * are required." />

    <div class="card card-body">
      <form class="form" novalidate @submit.prevent="submit">
        <FormErrorSummary
          v-if="attempted && (Object.keys(errors).length || serverMessage)"
          :errors="errors"
          :labels="LABELS"
          :message="serverMessage"
        />

        <fieldset class="fieldset">
          <legend>Where</legend>
          <BaseSelect
            id="spot_id"
            v-model="form.spot_id"
            label="Fishing spot"
            :options="spotOptions"
            :placeholder="spots.loading ? 'Loading spots…' : 'Choose a spot'"
            :error="errors.spot_id"
            required
          />
          <BaseInput id="caught_at" v-model="form.caught_at" type="date" label="Date caught" :max="todayLocalISO()" :error="errors.caught_at" required />
        </fieldset>

        <fieldset class="fieldset">
          <legend>What</legend>
          <BaseSelect
            id="species_id"
            v-model="form.species_id"
            label="Species"
            :options="speciesOptions"
            placeholder="Choose a species"
            :error="errors.species_id"
            :hint="selectedSpot ? 'Species known at this spot are listed first.' : ''"
            required
          />
          <figure v-if="selectedSpecies?.image_url" class="species-preview">
            <img :src="selectedSpecies.image_url" :alt="`Photo of a ${selectedSpecies.common_name.toLowerCase()}`">
            <figcaption>
              <strong>{{ selectedSpecies.local_name }}</strong> · {{ selectedSpecies.common_name }}
              <span class="muted">Photo: {{ selectedSpecies.image_credit }}</span>
            </figcaption>
          </figure>
          <div class="form-row">
            <BaseInput id="weight_kg" v-model="form.weight_kg" type="number" inputmode="decimal" step="0.01" min="0.01" max="500" label="Weight (kg)" hint="Example: 1.25" :error="errors.weight_kg" required />
            <BaseInput id="length_cm" v-model="form.length_cm" type="number" inputmode="decimal" step="0.1" min="1" max="400" label="Length (cm)" :error="errors.length_cm" optional />
          </div>
        </fieldset>

        <fieldset class="fieldset">
          <legend>How</legend>
          <div class="form-row">
            <BaseSelect id="method" v-model="form.method" label="Method" :options="FISHING_METHODS" :error="errors.method" required />
            <BaseInput id="bait" v-model="form.bait" label="Bait or lure" maxlength="60" placeholder="e.g. Live shrimp" :error="errors.bait" optional />
          </div>

          <div v-if="showReleaseWarning" class="alert alert-warning" role="status">
            <AppIcon name="shield" />
            <p><strong>{{ selectedSpecies.local_name }} is a protected species.</strong> {{ selectedSpecies.conservation_note }}</p>
          </div>

          <label class="checkbox">
            <input id="released" v-model="form.released" type="checkbox">
            <span><strong>I released this fish</strong> (catch-and-release)</span>
          </label>

          <BaseInput
            id="notes"
            v-model="form.notes"
            as="textarea"
            label="Notes"
            maxlength="500"
            placeholder="Weather, tide, what worked…"
            :hint="`${notesLeft} characters left`"
            :error="errors.notes"
            optional
          />
        </fieldset>

        <div class="form-actions">
          <NuxtLink to="/catches" class="btn btn-outline">Cancel</NuxtLink>
          <button type="submit" class="btn btn-accent" :disabled="submitting">
            <span v-if="submitting" class="spinner" aria-hidden="true" />
            <AppIcon v-else name="check" />
            {{ submitting ? 'Saving…' : 'Save catch' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.narrow { max-width: 760px; }
.fieldset { border: 0; padding: 0; margin: 0; display: grid; gap: var(--space-4); }
.fieldset + .fieldset { padding-top: var(--space-5); border-top: 1px solid var(--c-border); }
.fieldset legend { font-weight: 800; font-size: var(--fs-lg); margin-bottom: var(--space-3); padding: 0; }
.species-preview { margin: 0; display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3); background: var(--c-surface-2); border-radius: var(--radius-sm); }
.species-preview img { width: 120px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); flex: none; }
.species-preview figcaption { display: grid; gap: 2px; font-size: var(--fs-sm); }
.species-preview figcaption .muted { font-size: var(--fs-xs); }
.form-actions { display: flex; flex-wrap: wrap; gap: var(--space-3); justify-content: flex-end; padding-top: var(--space-4); border-top: 1px solid var(--c-border); }
@media (max-width: 639px) { .form-actions .btn { flex: 1; } }
</style>
