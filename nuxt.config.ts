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
      name: 'up',
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
