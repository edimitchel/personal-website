
export default defineNuxtRouteMiddleware((to, from) => {
    const store = layoutStore()
    
    store.title = to.meta.title as string ?? ''
    useHead({
        title: store.title
    })

    store.messages = []
    store.color = undefined
})