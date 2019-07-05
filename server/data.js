import Storyblok from 'storyblok-js-client'

import { transform } from './transformers'
import { getDefaultLang } from '../utils'

export const generateRoutes = async ({ token, isDev, options: { availableLangs, navLinks, defaultLang } }, callback) => {
  const $storyapi = new Storyblok({
    accessToken: token,
    cache: {
      clear: 'auto',
      type: 'memory'
    }
  });

  const version = isDev ? 'draft' : 'published'
  let cacheVersion = 0

  let routes = []

  availableLangs.forEach((lang) => {
    routes.push('/' + lang)
    navLinks.forEach(({ path }) => {
      routes.push('/' + lang + '/' + path)
    })
  })

  const blogRoute = navLinks.find(link => link.name === 'blog')

  const blogRoutes = availableLangs.map(async (lang) => {
    return $storyapi
      .get(`cdn/stories`, {
        starts_with: getDefaultLang(lang, defaultLang) + 'blog-posts',
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
  return Promise.all(blogRoutes).then((localizedRoutes) => { 
    localizedRoutes.forEach(r => {
      routes = routes.concat(r)
    })
    callback(null, routes)
  })
}

/**
 * 
 * @param {*}
 * 
 * @returns {Object.<String, import('./transformers/siteInformation').siteInformation>}
 */
export const getSiteInformation = async ({ token, langs, isDev, defaultLang }) => {
  const $storyapi = new Storyblok({
    accessToken: token,
    cache: {
      clear: 'auto',
      type: 'memory'
    }
  })

  const version = isDev ? 'draft' : 'published'

  const fetchInfo = await Promise.all(langs.map(async lang =>
    await $storyapi
      .get(`cdn/stories/${getDefaultLang(lang, defaultLang)}point-of-view`, {
        version
      })
      .then(({ data }) => data)
      .then(async ({ story }) => [lang, await transform('siteInformation', story.content)])
  ))
  return fetchInfo.reduce((acc, [lang, content]) => {
    acc = {
      ...acc,
      [lang]: content
    }
    return acc
  }, {})
}