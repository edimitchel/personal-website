
export default defineNuxtRouteMiddleware((to, from) => {
    const store = layoutStore()

    const appConfigTitle = useAppConfig().information.title;
    store.withEmoji = store.withEmoji ?? false;

    store.messages = []

    store.notTranslated = false
    store.color = undefined
    store.title = appConfigTitle!

    store.setDefaultHeaderImage();

})