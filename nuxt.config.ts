// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  ssr: false,

  // Nuxt 4 directory structure and features
  // https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    "@nuxt/fonts",
    "@nuxthq/studio"
  ],

  hub: {
    database: true,
    kv: true,
    blob: true,
    cache: true,
  },

  unocss: {
    configFile: 'uno.config.ts'
  },

  vue: {
    propsDestructure: true,
  },

  app: {
    rootAttrs: {
      id: 'app'
    },
    pageTransition: {
      name: 'up',
      mode: 'out-in',
    }
  },

  css: ['~/assets/style.css'],

  content: {
    documentDriven: true
  },

  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  // Development
  devtools: { enabled: true },

  compatibilityDate: '2024-07-03',
})