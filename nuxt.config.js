import path from 'path'

import { generateRoutes } from './server/data'

require('dotenv').config()

const { options } = require(path.join(__dirname, '/package'))
const title = options.title
const isDev = process.env.DEV || process.env.NODE_ENV === 'development'

const devConfig = () =>
  isDev && {
    debug: true,
    server: {
      timing: {
        total: true
      }
    }
  }

module.exports = {
  mode: 'universal',

  ...devConfig(),

  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: function (titleChunk) {
      const { title, meta } = this.$options.head
      const description = meta.find(m => m.hid === 'description').content
      return title === titleChunk ? `${title} - ${description}` : `${titleChunk} - ${title}`
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

  devModules: [
    '@nuxtjs/tailwindcss'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
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

  redirect: [{ from: '^/$', to: '/' + options.defaultLang }],

  router: {
    middleware: ['lang-redirect', 'page-name-blog']
  },

  env: {
    app: Object.assign(options, {
      emojis: {
        birthday: ['🥳', '🙌', '🎂', '🍰', '🎈', '🎉', '🎁'],
        normal: ['👋']
      }
    })
  },

  pageTransition: {
    name: 'fade',
    mode: 'out-in'
  },

  generate: {
    routes: (callback) => {
      const token = process.env.STORYBLOK_API_KEY
      return generateRoutes({ token, isDev, options }, callback)
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
