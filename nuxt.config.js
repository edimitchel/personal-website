require('dotenv').config()
const path = require('path')
const axios = require('axios')

const { options } = require(path.join(__dirname, '/package'))
const title = options.title;
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
      const description = meta.find(m => m.hid === 'description').content;
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
   ** Global CSS
   */
  css: ['assets/style/tailwind'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/axios'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/markdownit',
    '@nuxtjs/redirect-module',
    '@nuxtjs/moment',
    [
      'storyblok-nuxt',
      {
        accessToken: process.env.STORYBLOK_API_KEY,
        cacheProvider: 'memory'
      }
    ]
  ],

  moment: {
    locales: ['fr']
  },

  markdownit: {
    injected: true
  },

  redirect: [{ from: '^/$', to: '/' + options.defaultLang }],

  router: {
    middleware: 'lang-redirect'
  },

  env: {
    app: Object.assign(options, {
      emojis: {
        birthday: ['🥳', '🙌', '🎂', '🍰', '🎈', '🎉', '🎁'],
        normal: ['👋']
      }
    })
  },

  transition: {
    name: 'fade',
    mode: 'out-in'
  },

  generate: {
    routes: (callback) => {
      const token = process.env.STORYBLOK_API_KEY
      const version = isDev ? 'draft' : 'published'
      let cacheVersion = 0

      const routes = ['/fr/blog', '/en/blog']

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
                routes.push({
                  route: '/fr/blog/' + story.slug,
                  payload: story
                })
                routes.push({
                  route: '/en/blog/' + story.slug,
                  payload: story
                })
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
