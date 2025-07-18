
export default defineNuxtRouteMiddleware((to, from) => {
    const store = layoutStore()

    const appConfigTitle = useAppConfig().information.title;
    store.withEmoji = store.withEmoji ?? false;

    store.messages = []

    store.notTranslated = false
    store.color = undefined
    store.headerCover = undefined
    store.title = appConfigTitle!

  console.log('title', store.title);
  console.log('cover', store.headerCover);

})