/**
 * Thin wrapper around the $api client.
 * Turns any failed request into an Error with a friendly `message`,
 * plus `status`, `code` and field-level `details` from the API error envelope.
 */
export function normalizeApiError(err) {
  const body = err?.data
  const status = err?.statusCode ?? err?.status ?? err?.response?.status ?? 0
  const e = new Error(
    body?.error?.message
      || (status ? `Request failed (${status}). Please try again.` : 'Unable to reach the server. Check your connection and try again.'),
  )
  e.status = status
  e.code = body?.error?.code || (status ? 'HTTP_ERROR' : 'NETWORK_ERROR')
  e.details = body?.error?.details || null
  return e
}

export function useApi() {
  const { $api } = useNuxtApp()

  async function call(url, options) {
    try {
      return await $api(url, options)
    }
    catch (err) {
      throw normalizeApiError(err)
    }
  }

  return {
    get: (url, query) => call(url, { method: 'GET', query }),
    post: (url, body) => call(url, { method: 'POST', body }),
    put: (url, body) => call(url, { method: 'PUT', body }),
    del: url => call(url, { method: 'DELETE' }),
  }
}
