export default defineNuxtRouteMiddleware((to) => {
  const store = layoutStore()
  const appConfigTitle = useAppConfig().information.title

  store.withEmoji = store.withEmoji ?? false
  store.messages = []
  store.notTranslated = false
  store.color = undefined

  // Only reset title on non-detail pages — slug pages set their own title
  if (!to.params.slug) {
    store.title = appConfigTitle!
  }

  // Only project detail pages swap the header image
  const isProjectDetail = /^\/(?:en\/)?projects\/[^/]+\/?$/.test(to.path)
  if (!isProjectDetail) {
    store.setDefaultHeaderImage()
  }
})
