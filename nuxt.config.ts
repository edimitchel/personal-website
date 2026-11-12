import { collectPrerenderRoutes } from './scripts/collect-prerender-routes'

export default defineNuxtConfig({

  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    './modules/incremental-prerender',
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/image',
    '@pinia/nuxt',
    // Registers @nuxt/fonts, @nuxtjs/color-mode and @nuxt/icon.
    '@nuxt/ui',
    '@nuxtjs/i18n',
    'nuxt-og-image',
    'nuxt-schema-org',
    'nuxt-seo-utils',
  ],

  // Development
  devtools: { enabled: true },

  app: {
    rootAttrs: {
      id: 'app',
    },
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  css: ['~/assets/css/main.css', '~/assets/style.css'],

  vue: {
    propsDestructure: true,
  },

  site: {
    url: 'https://micheledighoffer.fr',
    name: 'Michel Edighoffer',
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    disableTransition: false,
  },

  ui: {
    prose: true,
  },

  icon: {
    serverBundle: {
      collections: ['mdi', 'logos', 'heroicons', 'lucide', 'line-md', 'ic', 'skill-icons', 'unjs', 'svg-spinners', 'noto-v1'],
    },
  },

  mdc: {
    highlight: {
      theme: {
        default: 'github-light',
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },

  content: {
    experimental: { nativeSqlite: true },
    preview: {
      dev: true,
      api: 'https://api.nuxt.studio',
      gitInfo: {
        name: 'personal-website',
        owner: 'edimitchel',
        url: 'https://github.com/edimitchel/personal-website',
      },
    },
    build: {
      transformers: ['~~/transformers/article-metadata'],
    },
  },
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
        },
      },
    },
  },
  compatibilityDate: '2026-06-25',

  runtimeConfig: {
    githubToken: '',
    github: {
      owner: 'edimitchel',
      repo: 'personal-website',
      branch: 'content/admin',
    },
    translation: {
      provider: 'xai',
      baseURL: '',
      model: '',
      apiKey: '',
    },
  },

  routeRules: {
    '/admin': { robots: false },
    '/admin/**': { robots: false },
    '/en/admin': { robots: false },
    '/en/admin/**': { robots: false },
  },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    prerender: {
      routes: collectPrerenderRoutes(),
      crawlLinks: false,
      failOnError: process.env.NUXT_PRERENDER_FAIL_ON_ERROR === 'true',
      ignore: ['/_og/**', '/admin', '/admin/**', '/en/admin', '/en/admin/**'],
    },
  },

  hub: {
    db: 'sqlite',
    blob: true,
    kv: true,
    cache: true,
  },

  vite: {
    optimizeDeps: {
      include: [
        '@unhead/schema-org/vue',
        '@nuxt/ui > prosemirror-state',
        '@nuxt/ui > prosemirror-transform',
        '@nuxt/ui > prosemirror-model',
        '@nuxt/ui > prosemirror-view',
        '@nuxt/ui > prosemirror-gapcursor',
      ],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    families: [
      { name: 'Gabarito', weights: [400, 500, 600, 700, 800, 900], global: true },
      { name: 'Source Code Pro', weights: [400, 500], global: true },
    ],
  },

  i18n: {
    langDir: 'locales',
    baseUrl: 'https://micheledighoffer.fr',
    locales: [
      { code: 'en', file: 'en.json', name: 'English', language: 'en' },
      { code: 'fr', file: 'fr.json', name: 'Français', language: 'fr' },
    ],
    strategy: 'prefix_except_default',
    defaultLocale: 'fr',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
    },
  },

  ogImage: {
    runtimeCacheStorage: true,
    defaults: {
      cacheMaxAgeSeconds:
        process.env.NODE_ENV === 'production' ? 60 * 60 * 24 * 31 : 0,
    },
    security: {
      // v7 rejects a string secret in this field. Signing uses
      // runtimeConfig.appSecret (NUXT_APP_SECRET). When that value is empty,
      // the module still reads NUXT_OG_IMAGE_SECRET from the environment and
      // from the Cloudflare binding, then warns once. The CI build step sets
      // that variable. `false` disables signing, and only in dev.
      secret: process.env.NODE_ENV === 'development' ? false : undefined,
      // The Workers preset renders with WASM resvg. A few images miss the 15s default.
      renderTimeout: 45_000,
    },
  },

  seo: {
    meta: {
      twitterCreator: '@edimitchel',
      author: 'Michel Edighoffer',
      colorScheme: 'dark light',
      applicationName: 'Michel Edighoffer',
      ogLocale: 'fr_FR',
      ogTitle: 'Michel Edighoffer',
    },
  },

})
