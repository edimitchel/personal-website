import Storyblok from 'storyblok-js-client'

import { transform } from './transformers'
import { getDefaultLang } from '../utils'

export const generateRoutes = async ({ token, isDev, data: { siteInformation, blogSlugs } }, callback) => {
  const { availableLangs, defaultLang, navLinks } = siteInformation;
  const $storyapi = new Storyblok({
    accessToken: token,
    cache: {
      clear: 'auto',
      type: 'memory'
    }
  });

  const blogRoute = lang => blogSlugs[lang];
  const version = isDev ? 'draft' : 'published'
  let routes = []

  availableLangs.forEach((lang) => {
    routes.push('/' + lang)
    navLinks.forEach(({ path }) => {
      if (path === 'blog') {
        routes.push('/' + lang + '/' + blogRoute(lang))
      } else {
        routes.push('/' + lang + '/' + path)
      }
    })
  })

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
            route: `/${lang}/${blogRoute(lang)}/${story.slug}`,
          })
          story.visions.forEach((vision) => {
            if (vision.type.slug) {
              newRoutes.push({
                route: `/${lang}/${blogRoute(lang)}/${story.slug}/${vision.type.slug}`,
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

/**
 * Execute fn for each route and its children
 * @param {Array} routes 
 * @param {Array} payload 
 * @param {Function} fn 
 * @param {number} level
 */
export const forEachChildren = (routes, payload, fn, level = 0) => {
  const newRoutes = routes;
  for (let i = routes.length - 1;i >= 0;i--) {
    const route = routes[i];
    if (route.children) {
      route.children = forEachChildren(route.children, payload, fn, level + 1);
    }
    const mappedRoutes = fn(route, payload, level)
    newRoutes.splice(i, 1, ...mappedRoutes);
  }
  return newRoutes;
}

/**
 * Replace all blog slug by the one specified on payload
 * @param {Object} route 
 * @param {Array} payload 
 * @param {number} level
 */
export const replaceBlogSlug = (route, payload, level) => {
  const newRoutes = [];
  if (level < 2 && route.name.indexOf('blog') >= 0) {
    payload.forEach(({ blog }) => {
      const newRoute = { ...route }
      newRoute.path = newRoute.path.replace('blog', blog.slug)
      newRoute.name = newRoute.name.replace('blog', blog.slug)
      newRoutes.push(newRoute);
    })
    return newRoutes;
  } else {
    return [route];
  }
}