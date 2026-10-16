// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  // Client-side rendered app (SPA). The pages sit behind interactions
  // (login, forms, filters), so SEO-oriented server rendering is not needed.
  ssr: false,

  devtools: { enabled: true },

  modules: ['@pinia/nuxt'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      // Base URL of the API. At midterm this points to the mock API in /server/api.
      // For the Final, set NUXT_PUBLIC_API_BASE to the real backend URL
      // (e.g. https://pangisda-api.onrender.com/api) — no frontend code changes needed.
      apiBase: '/api',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: '%s · Pangisda',
      title: 'Fishing spots & catch log',
      meta: [
        { name: 'description', content: 'Find fishing spots around Butuan and Agusan, log your catches, and practice responsible catch-and-release.' },
        { name: 'theme-color', content: '#0B4F6C' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
      ],
    },
  },
})
