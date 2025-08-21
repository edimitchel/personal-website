export default defineNuxtConfig({
  compatibilityDate: '2025-07-26',
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
        }
      }
    }
  },

  site: {
    url: 'https://micheledighoffer.fr',
    name: 'Michel Edighoffer'
  },

  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/content',
    '@unocss/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    'nuxt-og-image'
  ],

  unocss: {
    configFile: 'unocss/uno.config.ts',
    content: {
      filesystem: ['app/../content/*.vue'],
    }
  },

  vue: {
    propsDestructure: true,
  },

  app: {
    rootAttrs: {
      id: 'app'
    },
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  css: ['~/assets/style.css'],

  content: {
    experimental: { nativeSqlite: true },
    preview: {
      dev: true,
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'personal-website',
        owner: 'edimitchel',
        url: 'https://github.com/edimitchel/personal-website'
      }
    },
    build: {
      transformers: ['~~/transformers/article-metadata'],
    }
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  // Development
  devtools: { enabled: true },

  i18n: {
    restructureDir: '.',
    locales: [
      { code: 'en', file: 'en.json', name: 'English', language: 'en' },
      { code: 'fr', file: 'fr.json', name: 'Français', language: 'fr' }
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'fr',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
    },
  },

  hub: {
    database: true,
    blob: true,
  },
  ogImage: {
    runtimeCacheStorage: false,
    defaults: {
      cacheMaxAgeSeconds: process.env.NODE_ENV === 'production' ? 60 * 60 * 24 * 31 : 0
    },
    compatibility: {
      runtime: {
        satori: 'node',
        resvg: false,
        'css-inline': false,
        sharp: false,
        chromium: false
      }
    }
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    },
  }
})