// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['vuetify-nuxt-module', '@nuxtjs/i18n'],

  // ─── Vuetify ────────────────────────────────────────────────────────────────
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'light',
        themes: {
          light: {
            colors: {
              primary: '#1565C0',
              secondary: '#0288D1',
              surface: '#FFFFFF',
              background: '#EEF4FF',
            },
          },
          dark: {
            colors: {
              primary: '#42A5F5',
              secondary: '#29B6F6',
              surface: '#0D1B2A',
              background: '#060F1A',
            },
          },
        },
      },
    },
  },

  // ─── i18n ───────────────────────────────────────────────────────────────────
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'zh', name: '中文', file: 'zh.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    // restructureDir defaults to 'i18n/' (resolved from rootDir)
    // langDir is relative to restructureDir → locale files at: i18n/locales/
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang',
      redirectOn: 'root',
      alwaysRedirect: false,
    },
  },

  // ─── Vite (fix modulePreload polyfill sourcemap warning) ─────────────────────
  vite: {
    build: {
      modulePreload: {
        polyfill: false,
      },
    },
  },

  // ─── SSG ────────────────────────────────────────────────────────────────────
  nitro: {
    preset: 'static',
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
})
