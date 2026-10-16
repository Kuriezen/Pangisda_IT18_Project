export function formatDate(value) {
  if (!value) return ''
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatWeight(kg) {
  if (kg === null || kg === undefined) return '—'
  return kg < 1 ? `${Math.round(kg * 1000)} g` : `${Number(kg).toFixed(kg % 1 === 0 ? 0 : 1)} kg`
}

export function methodLabel(value) {
  return FISHING_METHODS.find(m => m.value === value)?.label || value
}

export function waterLabel(value) {
  return WATER_TYPES.find(w => w.value === value)?.label || value
}

export function accessLabel(value) {
  return ACCESS_LEVELS.find(a => a.value === value)?.label || value
}

/** Today's date as YYYY-MM-DD in the user's local time zone. */
export function todayLocalISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}
