export default ({ route, store }) => {
  if (/blog|point-of-view/.test(route.name)) {
    const { blogTitle } = store.getters['informations/get']
    store.commit('layout/setCustomPageName', blogTitle)
    store.commit('layout/setHideMenu', true)
  } else {
    store.commit('layout/setCustomPageName', null)
    store.commit('layout/setHideMenu', false)
  }
}
