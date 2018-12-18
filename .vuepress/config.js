module.exports = {
  postcss: {
    plugins: [require('tailwindcss')('./tailwind.js'), require('autoprefixer')],
  },
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
  themeConfig: {
    search: false,
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Blog', link: '/blog/' },
      { text: 'About', link: '/about/' },
      { text: 'Contact', link: '/contact/' },
    ],
    sidebar: false,
  }
}