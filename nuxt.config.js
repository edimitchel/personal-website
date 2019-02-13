require('dotenv').config()
const path = require('path')
const axios = require('axios')

const { options, ...pkg } = require(path.join(__dirname, '/package'))

const devConfig = () =>
  process.env.NODE_ENV === 'development' && {
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
  plugins: ['~/plugins/axios'],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // baseURL: process.env.API_URL || 'localhost'
  },

  env: {
    appOptions: Object.assign(options, {
      emojis: {
        birthday: ['🥳', '🙌', '🎂', '🍰', '🎈', '🎉', '🎁'],
        normal: ['👋']
      }
    })
  },

  generate: {
    routes: () => {
      return axios.get('/api/articles')
        .then((res) => {
          let blogPosts = []
          res.forEach((article) => {
            blogPosts.concat(article.localizedContent.map(content =>`/blog/${content.language}/${content.slug}`))
          })
          return blogPosts
        })
        .catch((e) => {
          console.error(e);
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
  },

  serverMiddleware: ['~/server/data']
}
