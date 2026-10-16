/**
 * Client-side validation. Each function returns an object of
 * { fieldName: 'error message' }; an empty object means the form is valid.
 * The same rules are enforced again by the API (server/utils/validation.js).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const isBlank = v => v === null || v === undefined || String(v).trim() === ''

export function validateCatch(form) {
  const e = {}
  if (isBlank(form.spot_id)) e.spot_id = 'Choose where you caught the fish.'
  if (isBlank(form.species_id)) e.species_id = 'Choose the species you caught.'

  if (isBlank(form.weight_kg)) e.weight_kg = 'Enter the weight in kilograms.'
  else {
    const w = Number(form.weight_kg)
    if (Number.isNaN(w) || w <= 0) e.weight_kg = 'Weight must be a number greater than 0.'
    else if (w > 500) e.weight_kg = 'That looks too heavy. The maximum is 500 kg.'
  }

  if (!isBlank(form.length_cm)) {
    const l = Number(form.length_cm)
    if (Number.isNaN(l) || l < 1 || l > 400) e.length_cm = 'Length must be between 1 and 400 cm.'
  }

  if (isBlank(form.caught_at)) e.caught_at = 'Enter the date of the catch.'
  else if (form.caught_at > todayLocalISO()) e.caught_at = 'The date cannot be in the future.'
  else if (form.caught_at < '2000-01-01') e.caught_at = 'The date must be in the year 2000 or later.'

  if (!FISHING_METHODS.some(m => m.value === form.method)) e.method = 'Choose a fishing method.'
  if (form.bait && form.bait.length > 60) e.bait = 'Keep the bait description to 60 characters or fewer.'
  if (form.notes && form.notes.length > 500) e.notes = 'Notes must be 500 characters or fewer.'
  return e
}

export function validateLogin(form) {
  const e = {}
  if (isBlank(form.email)) e.email = 'Enter your email address.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address, like name@example.com.'
  if (isBlank(form.password)) e.password = 'Enter your password.'
  return e
}

export function validateRegister(form) {
  const e = {}
  const name = (form.full_name || '').trim()
  if (name.length < 2) e.full_name = 'Enter your full name.'
  else if (name.length > 60) e.full_name = 'Full name must be 60 characters or fewer.'

  if (isBlank(form.username)) e.username = 'Choose a username.'
  else if (!/^[a-z0-9_]{3,20}$/.test(form.username)) e.username = 'Use 3–20 lowercase letters, numbers or underscores.'

  if (isBlank(form.email)) e.email = 'Enter your email address.'
  else if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address, like name@example.com.'

  const pw = form.password || ''
  if (!pw) e.password = 'Create a password.'
  else if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) e.password = 'Use at least 8 characters with at least one letter and one number.'

  if (!form.confirm_password) e.confirm_password = 'Re-enter your password.'
  else if (form.confirm_password !== pw) e.confirm_password = 'Passwords do not match.'

  if (!form.agree) e.agree = 'You must agree to the data privacy notice to continue.'
  return e
}

export function validateSpot(form) {
  const e = {}
  const name = (form.name || '').trim()
  if (name.length < 3 || name.length > 80) e.name = 'Name must be 3 to 80 characters.'
  if (isBlank(form.municipality)) e.municipality = 'Enter the municipality or city.'
  if (isBlank(form.province)) e.province = 'Enter the province.'
  if (!WATER_TYPES.some(w => w.value === form.water_type)) e.water_type = 'Choose a water type.'

  const lat = Number(form.latitude)
  if (isBlank(form.latitude) || Number.isNaN(lat) || lat < 4 || lat > 22) e.latitude = 'Latitude must be between 4 and 22 (within the Philippines).'
  const lng = Number(form.longitude)
  if (isBlank(form.longitude) || Number.isNaN(lng) || lng < 116 || lng > 127) e.longitude = 'Longitude must be between 116 and 127 (within the Philippines).'

  if ((form.description || '').trim().length < 20) e.description = 'Write at least 20 characters so anglers know what to expect.'
  return e
}

/** Moves keyboard focus to the first field that has an error. */
export function focusFirstError(errors) {
  const first = Object.keys(errors)[0]
  if (!first || typeof document === 'undefined') return
  requestAnimationFrame(() => document.getElementById(first)?.focus())
}
