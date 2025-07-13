
export default defineNuxtRouteMiddleware((to, from) => {
    const store = layoutStore()

    const appConfigTitle = useAppConfig().information.title;
    store.title = appConfigTitle ?? to.meta.title as string;
    store.withEmoji = store.withEmoji ?? false;

    useHead({
        title: store.title,
        meta: [
            {
                name: 'description',
                content: to.meta.description as string
            }
        ]
    })

    store.messages = []

    store.notTranslated = false
    store.color = undefined
})