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
    'nuxt-og-image',
    'nuxt-schema-org',
    'nuxt-seo-utils'
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
    baseUrl: 'https://micheledighoffer.fr',
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

  seo: {
    meta: {
      twitterCreator: '@edimitchel',
      author: 'Michel Edighoffer',
      colorScheme: 'dark light',
      applicationName: 'Michel Edighoffer',

      // Nuxt SEO Utils already sets the below tags for you
      ogSiteName: 'Michel Edighoffer',
      ogLocale: 'fr_FR',
      ogType: 'website',
      ogUrl: 'https://micheledighoffer.fr',
      ogTitle: 'Michel Edighoffer',

      // Other Nuxt SEO modules handles these
      ogImage: 'https://micheledighoffer.fr/__og-image__/static/og.png',
      robots: 'index, follow',
    }
  },

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true
    },
  }
})