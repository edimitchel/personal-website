
export default defineNuxtRouteMiddleware((to, from) => {
    const store = layoutStore()

    const appConfigTitle = useAppConfig().information.title;
    store.title = appConfigTitle ?? to.meta.title as string;
    console.log(store)
    store.withEmoji = to.meta.withEmoji as boolean ?? false;

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
    store.color = undefined
})