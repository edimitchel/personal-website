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
    '@nuxt/fonts',
    '@nuxtjs/i18n'
  ],

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
      name: 'fade',
      mode: 'out-in',
    },
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
      markdown: {}
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
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'fr', file: 'fr.json', name: 'Français' }
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'en'
  },

  nitro: {
    prerender: {
      // Pre-render the homepage
      routes: ['/'],
      // Then crawl all the links on the page
      crawlLinks: true
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            '/articles/*',
            '/projects/*'
          ]
        }
      }
    }
  }
})