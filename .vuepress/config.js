const path = require('path');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  description: 'a french front-end develop',
  title: 'Michel Edighoffer, front-end developer',
  plugins: [
    [
      '@vuepress/pwa',
      {
        serviceWorker: true,
        updatePopup: {
          message: "New content is available.",
          buttonText: "Refresh"
        }
      },
    ],
    '@vuepress/medium-zoom',
  ],
  postcss: {
    plugins: [tailwindcss('./tailwind.js'), autoprefixer],
  },
  themeConfig: {
    search: false,
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'About', link: '/about/' },
      { text: 'Contact', link: '/contact/' },
    ],
    sidebar: false,
  },
  chainWebpack: (config, isServer) => {
    config.resolve.alias.set('@components', path.resolve(__dirname, '..', 'components'));
  },
}