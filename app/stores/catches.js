/**
 * Catches store — the community catch log, feed filters and per-user stats.
 * This is the main "core feature" that uses state management.
 */
export const useCatchesStore = defineStore('catches', () => {
  const items = ref([])
  const loading = ref(false)
  const error = ref(null)
  const loaded = ref(false)

  const filters = reactive({ speciesId: '', waterType: '', releasedOnly: false, sort: 'newest' })

  const filtered = computed(() => {
    const list = items.value.filter((c) => {
      if (filters.speciesId && c.species?.id !== Number(filters.speciesId)) return false
      if (filters.waterType && c.spot?.water_type !== filters.waterType) return false
      if (filters.releasedOnly && !c.released) return false
      return true
    })
    const sorters = {
      newest: (a, b) => b.caught_at.localeCompare(a.caught_at) || b.id - a.id,
      oldest: (a, b) => a.caught_at.localeCompare(b.caught_at) || a.id - b.id,
      heaviest: (a, b) => b.weight_kg - a.weight_kg,
    }
    return [...list].sort(sorters[filters.sort] || sorters.newest)
  })

  const releaseRate = computed(() => {
    if (!items.value.length) return 0
    return Math.round((items.value.filter(c => c.released).length / items.value.length) * 100)
  })

  function bySpot(spotId) {
    return items.value.filter(c => c.spot?.id === Number(spotId))
  }

  function byUser(userId) {
    return items.value.filter(c => c.user?.id === Number(userId))
  }

  function statsForUser(userId) {
    const mine = byUser(userId)
    const totalWeight = mine.reduce((sum, c) => sum + Number(c.weight_kg || 0), 0)
    const best = mine.reduce((top, c) => (!top || c.weight_kg > top.weight_kg ? c : top), null)
    const released = mine.filter(c => c.released).length
    return {
      count: mine.length,
      totalWeight: Math.round(totalWeight * 100) / 100,
      best,
      releaseRate: mine.length ? Math.round((released / mine.length) * 100) : 0,
      spotsVisited: new Set(mine.map(c => c.spot?.id)).size,
    }
  }

  function resetFilters() {
    filters.speciesId = ''
    filters.waterType = ''
    filters.releasedOnly = false
    filters.sort = 'newest'
  }

  async function fetchAll({ force = false } = {}) {
    if (loaded.value && !force) return
    const api = useApi()
    loading.value = true
    error.value = null
    try {
      const res = await api.get('/catches')
      items.value = res.data
      loaded.value = true
    }
    catch (e) {
      error.value = e.message
    }
    finally {
      loading.value = false
    }
  }

  async function create(form) {
    const api = useApi()
    const payload = {
      spot_id: Number(form.spot_id),
      species_id: Number(form.species_id),
      weight_kg: Number(form.weight_kg),
      length_cm: form.length_cm === '' || form.length_cm === null ? null : Number(form.length_cm),
      caught_at: form.caught_at,
      method: form.method,
      bait: form.bait?.trim() || null,
      released: Boolean(form.released),
      notes: form.notes?.trim() || null,
    }
    const res = await api.post('/catches', payload)
    items.value = [res.data, ...items.value]
    useSpotsStore().adjustCatchCount(res.data.spot_id, 1)
    return res.data
  }

  async function remove(id) {
    const api = useApi()
    const target = items.value.find(c => c.id === id)
    await api.del(`/catches/${id}`)
    items.value = items.value.filter(c => c.id !== id)
    if (target) useSpotsStore().adjustCatchCount(target.spot_id, -1)
  }

  return {
    items, loading, error, loaded, filters, filtered, releaseRate,
    bySpot, byUser, statsForUser, resetFilters, fetchAll, create, remove,
  }
})
