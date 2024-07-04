
export default defineNuxtRouteMiddleware(() => {
    if (import.meta.client) {
        const store = layoutStore()
        onBeforeRouteLeave((to, from, next) => {
            store.title = ''
            next()
        })
    }
})