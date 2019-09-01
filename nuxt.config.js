import path from 'path'

import { generateRoutes, getSiteInformation } from './server/data'

require('dotenv').config()

const { options } = require(path.join(__dirname, '/package'))
const title = options.title
const isDev = process.env.DEV || process.env.NODE_ENV === 'development'
const token = process.env.STORYBLOK_API_KEY

const devConfig = () =>
  isDev && {
    debug: true,
    server: {
      timing: {
        total: true
      }
    }
  }

export default async () => {
  const siteInformations = await getSiteInformation({
    token,
    langs: options.availableLangs,
    isDev,
    defaultLang: options.defaultLang
  })

  const siteInformation = {
    ...siteInformations[options.defaultLang],
    ...options
  }

  return {
    mode: 'universal',

    ...devConfig(),

    /*
     ** Headers of the page
     */
    head: {
      titleTemplate: function(titleChunk) {
        if (this) {
          const { title, meta } = this.$options.head
          const description = meta.find(m => m.hid === 'description').content
          return title === titleChunk ? `${title} - ${description}` : `${titleChunk} - ${title}`
        }
        return titleChunk
      },
      title,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: options.description }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href:
            'https://fonts.googleapis.com/css?family=Source+Code+Pro:400,700|Work+Sans:400,600'
        }
      ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: false,

    /*
     ** Plugins to load before mounting the App
     */
    plugins: ['~/plugins/axios'],

    buildModules: [
      '@nuxtjs/tailwindcss'
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
      '@nuxtjs/axios',
      '@nuxtjs/pwa',
      '@nuxtjs/markdownit',
      '@nuxtjs/redirect-module',
      '@nuxtjs/moment',
      'nuxt-payload-extractor',
      [
        'storyblok-nuxt',
        {
          accessToken: process.env.STORYBLOK_API_KEY,
          cacheProvider: 'memory'
        }
      ]
    ],

    tailwindcss: {
      configPath: '~/config/tailwind.js',
      cssPath: '~/assets/style/tailwind.css'
    },

    moment: {
      locales: ['fr']
    },

    markdownit: {
      injected: true
    },

    // redirect: [{ from: '^/$', to: '/' + siteInformation.defaultLocale }],

    router: {
      middleware: ['lang-redirect', 'page-name-blog']
    },

    env: {
      info: siteInformation,
      infos: siteInformations,
      isDev
    },

    pageTransition: {
      name: 'fade',
      mode: 'out-in'
    },

    generate: {
      routes: (callback) => {
        return generateRoutes({ token, isDev, options: siteInformation }, callback)
      }
    },

    /*
     ** Build configuration
     */
    build: {
      /*
       ** You can extend webpack config here
       */
      extend(config, ctx) {
        // Run ESLint on save
        if (ctx.isDev && ctx.isClient) {
          // config.module.rules.push({
          //   enforce: 'pre',
          //   test: /\.(js|vue)$/,
          //   loader: 'eslint-loader',
          //   exclude: /(node_modules)/
          // })
        }
      },
      extractCSS: true,

      build: {
        watch: ['server']
      }
    }
  }
}
