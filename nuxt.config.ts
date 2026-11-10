import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { collectPrerenderRoutes } from './scripts/collect-prerender-routes'

const require = createRequire(import.meta.url)
const mdcProseDir = join(dirname(require.resolve('@nuxtjs/mdc')), 'runtime/components/prose')

export default defineNuxtConfig({

  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    './modules/incremental-prerender',
    '@nuxthub/core',
    '@nuxt/eslint',
    '@nuxt/content',
    '@unocss/nuxt',
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
    // Keep -mode so UnoCSS (.dark-mode) and app.vue keep working.
    // Nuxt UI defaults to an empty suffix (.dark). main.css extends the dark variant to .dark-mode.
    classSuffix: '-mode',
    disableTransition: false,
  },

  ui: {
    // Public prose stays on UnoCSS. 4.10 still registers Prose* when Content is installed.
    prose: false,
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
      ignore: ['/_og/**'],
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
      // v7 only accepts `false` here. Signing comes from NUXT_APP_SECRET,
      // with NUXT_OG_IMAGE_SECRET still read when that secret is empty.
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

  hooks: {
    'components:extend'(components) {
      // Nuxt UI 4.10 registers Prose* whenever Content is installed and wins the name clash.
      // Point the shared tags back at @nuxtjs/mdc so UnoCSS `.prose` still styles real h1/p/a/…
      // Keep the app ProseImg. Leave Nuxt UI-only tags (callout, accordion, …) untouched.
      for (let index = components.length - 1; index >= 0; index--) {
        const component = components[index]
        if (!component?.filePath.includes('/node_modules/@nuxt/ui/') || !component.pascalName.startsWith('Prose')) {
          continue
        }
        if (component.pascalName === 'ProseImg') {
          components.splice(index, 1)
          continue
        }
        const replacement = join(mdcProseDir, `${component.pascalName}.vue`)
        if (existsSync(replacement)) {
          component.filePath = replacement
          component.declarationPath = replacement
        }
      }
    },
  },
})
