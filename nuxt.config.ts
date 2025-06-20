// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

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
    "@nuxt/fonts"
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
    preview: {
      api: 'https://api.nuxt.studio'
    }
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
