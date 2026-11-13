export function routeContentPath(routePath: string) {
  const english = routePath === '/en' || routePath.startsWith('/en/')
  const bare = english ? (routePath.slice(3) || '/') : routePath
  const folder = english ? '' : 'fr/'
  if (bare === '/') {
    return `pages/${folder}about.md`
  }
  if (bare === '/legal') {
    return `pages/${folder}legal.md`
  }
  if (bare === '/articles') {
    return `pages/${folder}blog.md`
  }
  if (bare === '/projects') {
    return `pages/${folder}project.md`
  }
  const article = bare.match(/^\/articles\/([^/]+)$/)
  if (article?.[1]) {
    return `articles/${folder}${article[1]}.md`
  }
  const project = bare.match(/^\/projects\/([^/]+)$/)
  if (project?.[1]) {
    return `projects/${folder}${project[1]}.md`
  }
  return null
}
