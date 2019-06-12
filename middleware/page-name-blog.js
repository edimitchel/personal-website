export default ({ env, route, store }) => {
  if (/blog|point-of-views/.test(route.name)) {
    store.commit('layout/setCustomPageName', env.app.blog.title)
    store.commit('layout/setHideMenu', true)
  } else {
    store.commit('layout/setCustomPageName', null)
    store.commit('layout/setHideMenu', false)
  }
}
