require('dotenv').config()
const path = require('path')
const axios = require('axios')

const { options, ...pkg } = require(path.join(__dirname, '/package'))

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
    title: options.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
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
   ** Global CSS
   */
  css: ['assets/style/tailwind'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios',
    '~/plugins/moment'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    ['@nuxtjs/moment', { locales: ['fr'], defaultLocale: 'en' }],
    [
      'storyblok-nuxt',
      {
        accessToken: process.env.STORYBLOK_API_KEY,
        cacheProvider: 'memory'
      }
    ]
  ],

  markdownit: {
    injected: true
  },

  env: {
    app: Object.assign(options, {
      emojis: {
        birthday: ['🥳', '🙌', '🎂', '🍰', '🎈', '🎉', '🎁'],
        normal: ['👋']
      }
    })
  },

  generate: {
    routes: function(callback) {
      const token = process.env.STORYBLOK_API_KEY
      const version = isDev ? 'draft' : 'published'
      let cacheVersion = 0

      const routes = ['/blog/en']

      axios
        .get(`https://api.storyblok.com/v1/cdn/spaces/me?token=${token}`)
        .then((spaceRes) => {
          cacheVersion = spaceRes.data.space.version
          axios
            .get(
              `https://api.storyblok.com/v1/cdn/stories?starts_with=${`blog-posts`}&token=${token}&version=${version}&cv=${cacheVersion}`
            )
            .then((res) => {
              res.data.stories.forEach((story) => {
                routes.push('/blog/' + story.slug)
                routes.push('/blog/en/' + story.slug)
              })

              callback(null, routes)
            })
        })
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
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },

    build: {
      watch: ['server']
    }
  }
}
