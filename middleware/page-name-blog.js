export default ({ route, store }) => {
  const { blog: { slug, title } } = store.getters['informations/get']
  const blogSlugRegExp = new RegExp(slug, 'i');
  if (blogSlugRegExp.test(route.name)) {
    store.commit('layout/setCustomPageName', title)
    store.commit('layout/setHideMenu', true)
  } else {
    store.commit('layout/setCustomPageName', null)
    store.commit('layout/setHideMenu', false)
  }
}
