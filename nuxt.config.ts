import { join } from 'node:path'
import { collectPrerenderRoutes } from './scripts/collect-prerender-routes'
import {
  createPrerenderPlan,
  logPrerenderPlan,
  restoreCachedRoutes,
  savePrerenderedRoutes,
  type PrerenderPlan,
} from './scripts/incremental-prerender-lib'

const prerenderState: { plan: PrerenderPlan | null } = { plan: null }

export default defineNuxtConfig({

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

  css: ['~/assets/style.css'],

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

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    prerender: {
      routes: collectPrerenderRoutes(),
      crawlLinks: false,
      failOnError: false,
      ignore: ['/_og/**'],
    },
    hooks: {
      'prerender:routes': (routes) => {
        prerenderState.plan = createPrerenderPlan()
        logPrerenderPlan(prerenderState.plan)
        for (const route of [...routes]) {
          routes.delete(route)
        }
        for (const route of prerenderState.plan.routesToPrerender) {
          routes.add(route)
        }
      },
      'prerender:done': async (result) => {
        const plan = prerenderState.plan ?? createPrerenderPlan()
        const publicDir = join(process.cwd(), '.output/public')
        savePrerenderedRoutes(result.prerenderedRoutes, publicDir, {
          resetManifest: !plan.enabled || plan.shellChanged,
        })
        restoreCachedRoutes(plan.routesToRestore, publicDir)
      },
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
      secret:
        process.env.NUXT_OG_IMAGE_SECRET
        || (process.env.NODE_ENV === 'development' ? false : undefined),
    },
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

      robots: 'index, follow',
    },
  },

  unocss: {
    configFile: 'unocss/uno.config.ts',
    content: {
      filesystem: ['app/../content/*.vue'],
    },
  },
})
