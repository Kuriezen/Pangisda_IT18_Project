<script setup>
/** Admin only: add, edit and delete fishing spots. */
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Manage spots' })

const spots = useSpotsStore()
const ui = useUiStore()

onMounted(() => spots.fetchAll())

const blank = () => ({ name: '', municipality: '', province: '', water_type: '', latitude: '', longitude: '', best_time: '', access_level: 'moderate', description: '' })
const form = reactive(blank())
const editingId = ref(null)
const errors = ref({})
const attempted = ref(false)
const saving = ref(false)
const serverMessage = ref('')
const deletingId = ref(null)

const LABELS = { name: 'Name', municipality: 'Municipality', province: 'Province', water_type: 'Water type', latitude: 'Latitude', longitude: 'Longitude', description: 'Description' }

watch(form, () => { if (attempted.value) errors.value = validateSpot(form) }, { deep: true })

function resetForm() {
  Object.assign(form, blank())
  editingId.value = null
  errors.value = {}
  attempted.value = false
  serverMessage.value = ''
}

function startEdit(spot) {
  resetForm()
  editingId.value = spot.id
  for (const key of Object.keys(form)) form[key] = spot[key] ?? ''
  requestAnimationFrame(() => {
    document.getElementById('spot-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    document.getElementById('name')?.focus({ preventScroll: true })
  })
}

async function save() {
  attempted.value = true
  serverMessage.value = ''
  errors.value = validateSpot(form)
  if (Object.keys(errors.value).length) return focusFirstError(errors.value)

  saving.value = true
  const payload = { ...form, latitude: Number(form.latitude), longitude: Number(form.longitude) }
  try {
    if (editingId.value) {
      await spots.update(editingId.value, payload)
      ui.notify(`${payload.name} updated.`)
    }
    else {
      await spots.create(payload)
      ui.notify(`${payload.name} added.`)
    }
    resetForm()
  }
  catch (e) {
    serverMessage.value = e.message
    if (e.details) errors.value = { ...e.details }
  }
  finally {
    saving.value = false
  }
}

async function removeSpot(spot) {
  if (!window.confirm(`Delete "${spot.name}"? This cannot be undone.`)) return
  deletingId.value = spot.id
  try {
    await spots.remove(spot.id)
    ui.notify(`${spot.name} deleted.`)
    if (editingId.value === spot.id) resetForm()
  }
  catch (e) {
    ui.notify(e.message, 'error', 6000)
  }
  finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="container">
    <PageHeader eyebrow="Administrator" title="Manage fishing spots" subtitle="Add new spots, correct details, or remove spots that are closed. A spot with logged catches cannot be deleted." />

    <div class="admin-grid">
      <section class="card" aria-labelledby="spots-table-heading">
        <h2 id="spots-table-heading" class="sr-only">All spots</h2>
        <ErrorState v-if="spots.error" :message="spots.error" @retry="spots.fetchAll({ force: true })" />
        <div v-else-if="spots.loading && !spots.items.length" class="card-body" role="status">Loading spots…</div>
        <div v-else class="table-wrap">
          <table class="table">
            <caption>{{ spots.items.length }} fishing spots</caption>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Location</th>
                <th scope="col">Water</th>
                <th scope="col">Catches</th>
                <th scope="col"><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="spot in spots.items" :key="spot.id" :class="{ editing: editingId === spot.id }">
                <th scope="row"><NuxtLink :to="`/spots/${spot.id}`">{{ spot.name }}</NuxtLink></th>
                <td>{{ spot.municipality }}, {{ spot.province }}</td>
                <td><WaterBadge :type="spot.water_type" /></td>
                <td>{{ spot.catch_count }}</td>
                <td class="actions">
                  <button type="button" class="btn btn-ghost btn-sm" @click="startEdit(spot)">
                    <AppIcon name="edit" /> Edit<span class="sr-only"> {{ spot.name }}</span>
                  </button>
                  <button type="button" class="btn btn-danger btn-sm" :disabled="deletingId === spot.id" @click="removeSpot(spot)">
                    <AppIcon name="trash" /> {{ deletingId === spot.id ? 'Deleting…' : 'Delete' }}<span class="sr-only"> {{ spot.name }}</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section id="spot-form" class="card card-body" aria-labelledby="spot-form-heading">
        <h2 id="spot-form-heading">{{ editingId ? 'Edit spot' : 'Add a new spot' }}</h2>
        <form class="form" novalidate @submit.prevent="save">
          <FormErrorSummary v-if="attempted && (Object.keys(errors).length || serverMessage)" :errors="errors" :labels="LABELS" :message="serverMessage" />
          <BaseInput id="name" v-model="form.name" label="Spot name" :error="errors.name" required />
          <div class="form-row">
            <BaseInput id="municipality" v-model="form.municipality" label="Municipality / city" :error="errors.municipality" required />
            <BaseInput id="province" v-model="form.province" label="Province" :error="errors.province" required />
          </div>
          <div class="form-row">
            <BaseSelect id="water_type" v-model="form.water_type" label="Water type" :options="WATER_TYPES" placeholder="Choose…" :error="errors.water_type" required />
            <BaseSelect id="access_level" v-model="form.access_level" label="Access" :options="ACCESS_LEVELS" />
          </div>
          <div class="form-row">
            <BaseInput id="latitude" v-model="form.latitude" type="number" step="0.0001" label="Latitude" hint="e.g. 8.9480" :error="errors.latitude" required />
            <BaseInput id="longitude" v-model="form.longitude" type="number" step="0.0001" label="Longitude" hint="e.g. 125.5430" :error="errors.longitude" required />
          </div>
          <BaseInput id="best_time" v-model="form.best_time" label="Best time to fish" placeholder="e.g. Early morning, Nov–Mar" optional />
          <BaseInput id="description" v-model="form.description" as="textarea" label="Description" :error="errors.description" required />
          <div class="form-actions">
            <button v-if="editingId" type="button" class="btn btn-outline" @click="resetForm">Cancel edit</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner" aria-hidden="true" />
              {{ saving ? 'Saving…' : editingId ? 'Save changes' : 'Add spot' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.admin-grid { display: grid; gap: var(--space-5); }
@media (min-width: 1200px) { .admin-grid { grid-template-columns: 1.4fr 1fr; align-items: start; } }
.admin-grid > .card:first-child { overflow: hidden; }
tr.editing { background: var(--c-primary-soft); }
.form-actions { display: flex; flex-wrap: wrap; gap: var(--space-3); justify-content: flex-end; }
</style>
