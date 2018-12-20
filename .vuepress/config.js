const path = require("path");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

module.exports = {
  description: "a french front-end developer",
  title: "Michel Edighoffer, front-end developer",
  plugins: [
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: {
          message: "New content is available.",
          buttonText: "Refresh"
        }
      }
    ],
    "@vuepress/medium-zoom"
  ],
  postcss: {
    plugins: [tailwindcss("./tailwind.js"), autoprefixer]
  },
  themeConfig: {
    name: "Michel EDIGHOFFER",
    birthdate: "1993-02-28",
    lastUpdated: "Last Updated",
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "/blog/" },
      { text: "About", link: "/about/" },
      { text: "Contact", link: "/contact/" }
    ],
    emoji: {
      birthday: ["🥳", "🙌", "🎂", "🍰", "🎈", "🎉", "🎁"],
      normal: ["👋"]
    },
    search: false,
    sidebar: false
  },
  chainWebpack: (config) => {
    config.resolve.alias.set(
      "@vuepress",
      path.resolve(__dirname)
    );
  }
};
