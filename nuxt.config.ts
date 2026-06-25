export default defineNuxtConfig({
  compatibilityDate: "2026-06-25",
  experimental: {
    defaults: {
      nuxtLink: {
        prefetchOn: {
          interaction: true,
        },
      },
    },
  },

  site: {
    url: "https://micheledighoffer.fr",
    name: "Michel Edighoffer",
  },

  // Nuxt Modules
  // https://nuxt.com/modules
  modules: [
    "@nuxthub/core",
    "@nuxt/eslint",
    "@nuxt/content",
    "@unocss/nuxt",
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "nuxt-og-image",
    "nuxt-schema-org",
    "nuxt-seo-utils",
  ],

  unocss: {
    configFile: "unocss/uno.config.ts",
    content: {
      filesystem: ["app/../content/*.vue"],
    },
  },

  vue: {
    propsDestructure: true,
  },

  app: {
    rootAttrs: {
      id: "app",
    },
    pageTransition: {
      name: "fade",
      mode: "out-in",
    },
  },

  colorMode: {
    preference: "system",
    fallback: "light",
  },

  css: ["~/assets/style.css"],

  fonts: {
    families: [
      { name: "Gabarito", weights: [400, 500, 600, 700, 800, 900], global: true },
      { name: "Source Code Pro", weights: [400, 500], global: true },
    ],
  },

  content: {
    experimental: { nativeSqlite: true },
    preview: {
      dev: true,
      api: "https://api.nuxt.studio",
      gitInfo: {
        name: "personal-website",
        owner: "edimitchel",
        url: "https://github.com/edimitchel/personal-website",
      },
    },
    build: {
      transformers: ["~~/transformers/article-metadata"],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  // Development
  devtools: { enabled: true },

  i18n: {
    langDir: "locales",
    baseUrl: "https://micheledighoffer.fr",
    locales: [
      { code: "en", file: "en.json", name: "English", language: "en" },
      { code: "fr", file: "fr.json", name: "Français", language: "fr" },
    ],
    strategy: "prefix_except_default",
    defaultLocale: "fr",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@unhead/schema-org/vue',
      ]
    }
  },

  hub: {
    db: "sqlite",
    blob: true,
    kv: true,
    cache: true,
  },

  ogImage: {
    runtimeCacheStorage: false,
    defaults: {
      cacheMaxAgeSeconds:
        process.env.NODE_ENV === "production" ? 60 * 60 * 24 * 31 : 0,
    },
    security: {
      secret:
        process.env.NUXT_OG_IMAGE_SECRET
        || (process.env.NODE_ENV === "development" ? false : undefined),
    },
  },

  seo: {
    meta: {
      twitterCreator: "@edimitchel",
      author: "Michel Edighoffer",
      colorScheme: "dark light",
      applicationName: "Michel Edighoffer",

      // Nuxt SEO Utils already sets the below tags for you
      ogSiteName: "Michel Edighoffer",
      ogLocale: "fr_FR",
      ogType: "website",
      ogUrl: "https://micheledighoffer.fr",
      ogTitle: "Michel Edighoffer",

      robots: "index, follow",
    },
  },

  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
    prerender: {
      routes: ["/"],
      crawlLinks: true,
      ignore: [
        // FR-only projects — no English content to prerender
        "/en/projects/intclen",
        "/en/projects/pictake",
      ],
    },
  },
});