/**
 * Spots store — fishing spots, species, list filters and saved (favorite) spots.
 */
export const useSpotsStore = defineStore('spots', () => {
  const items = ref([])
  const species = ref([])
  const loading = ref(false)
  const error = ref(null)
  const loaded = ref(false)

  const filters = reactive({ search: '', waterType: '', province: '' })

  // Saved spots are kept per browser (cookie) in the midterm.
  // Planned for the Final: a `favorites` table and /api/favorites endpoints.
  const favoriteIds = useCookie('pangisda_favorites', { default: () => [], maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })

  const provinces = computed(() => [...new Set(items.value.map(s => s.province))].sort())

  const filtered = computed(() => {
    const term = filters.search.trim().toLowerCase()
    return items.value.filter((s) => {
      if (filters.waterType && s.water_type !== filters.waterType) return false
      if (filters.province && s.province !== filters.province) return false
      if (term && !`${s.name} ${s.municipality} ${s.province}`.toLowerCase().includes(term)) return false
      return true
    })
  })

  const favorites = computed(() => items.value.filter(s => favoriteIds.value.includes(s.id)))

  function getById(id) {
    return items.value.find(s => s.id === Number(id)) || null
  }

  function speciesById(id) {
    return species.value.find(s => s.id === Number(id)) || null
  }

  function isFavorite(id) {
    return favoriteIds.value.includes(id)
  }

  function toggleFavorite(id) {
    favoriteIds.value = isFavorite(id)
      ? favoriteIds.value.filter(f => f !== id)
      : [...favoriteIds.value, id]
    return isFavorite(id)
  }

  function resetFilters() {
    filters.search = ''
    filters.waterType = ''
    filters.province = ''
  }

  async function fetchAll({ force = false } = {}) {
    if (loaded.value && !force) return
    const api = useApi()
    loading.value = true
    error.value = null
    try {
      const [spotsRes, speciesRes] = await Promise.all([api.get('/spots'), api.get('/species')])
      items.value = spotsRes.data
      species.value = speciesRes.data
      loaded.value = true
    }
    catch (e) {
      error.value = e.message
    }
    finally {
      loading.value = false
    }
  }

  // ----- Admin actions -----
  async function create(payload) {
    const api = useApi()
    const res = await api.post('/spots', payload)
    items.value = [...items.value, res.data].sort((a, b) => a.name.localeCompare(b.name))
    return res.data
  }

  async function update(id, payload) {
    const api = useApi()
    const res = await api.put(`/spots/${id}`, payload)
    items.value = items.value.map(s => (s.id === id ? res.data : s))
    return res.data
  }

  async function remove(id) {
    const api = useApi()
    await api.del(`/spots/${id}`)
    items.value = items.value.filter(s => s.id !== id)
    favoriteIds.value = favoriteIds.value.filter(f => f !== id)
  }

  /** Keeps the per-spot catch counter in sync after a catch is added or deleted. */
  function adjustCatchCount(spotId, delta) {
    const spot = getById(spotId)
    if (spot) spot.catch_count = Math.max(0, spot.catch_count + delta)
  }

  return {
    items, species, loading, error, loaded, filters, favoriteIds,
    provinces, filtered, favorites,
    getById, speciesById, isFavorite, toggleFavorite, resetFilters,
    fetchAll, create, update, remove, adjustCatchCount,
  }
})
