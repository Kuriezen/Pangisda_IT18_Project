/**
 * UI store — toast notifications shown after actions (saved, deleted, errors).
 */
export const useUiStore = defineStore('ui', () => {
  const toasts = ref([])
  let counter = 0

  function dismiss(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function notify(message, type = 'success', timeout = 4000) {
    const id = ++counter
    toasts.value = [...toasts.value, { id, message, type }]
    if (timeout) setTimeout(() => dismiss(id), timeout)
    return id
  }

  return { toasts, notify, dismiss }
})
