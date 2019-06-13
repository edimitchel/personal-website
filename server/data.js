import Storyblok from 'storyblok-js-client'

import { transform } from './transformers'
import { getDefaultLang } from '../utils'

export const generateRoutes = async ({ token, isDev, options: { availableLangs, navLinks } }, callback) => {
  const $storyapi = new Storyblok({
    accessToken: token,
    cache: {
      clear: 'auto',
      type: 'memory'
    }
  });

  const version = isDev ? 'draft' : 'published'
  let cacheVersion = 0

  const routes = []

  availableLangs.forEach((lang) => {
    routes.push('/' + lang)
    navLinks.forEach(({ path }) => {
      routes.push('/' + lang + '/' + path)
    })
  })

  const blogRoute = navLinks.find(link => link.title === 'blog') || { path: 'pont-of-views' }

  const blogRoutes = availableLangs.map(async (lang) => {
    return $storyapi
      .get(`cdn/stories`, {
        starts_with: getDefaultLang(lang, 'fr') + 'blog-posts',
        version
      })
      .then(async ({ data }) => {
        const newRoutes = [];
        const transformedStories = await transform('story', data.stories, { api: $storyapi, version })
        transformedStories.forEach((story) => {
          newRoutes.push({
            route: `/${lang}/${blogRoute.path}/${story.slug}`,
          })
          story.visions.forEach((vision) => {
            if (vision.type.slug) {
              newRoutes.push({
                route: `/${lang}/${blogRoute.path}/${story.slug}/${vision.type.slug}`,
              })
            }
          })
        })
        return newRoutes;
      });
  })
  return Promise.all(blogRoutes).then(([fr, en]) => callback(null, [...routes, ...fr, ...en]))
}
