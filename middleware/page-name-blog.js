export default ({ env, route, store }) => {
  if (/blog|point-of-views/.test(route.name)) {
    store.commit('layout/setCustomPageName', env.app.blog.title)
  } else {
    store.commit('layout/setCustomPageName', null)
  }
}
