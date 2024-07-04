import defaultImage from '~/assets/images/self-image.png'

export type State = {
    messages: string[],
    title: string
    color?: string,
    hideMenu: boolean,
    headerImage: {
        src: string,
        title: string
    },
    headerCover?: {
        src: string
    }
}

export const layoutStore = defineStore('layout', () => {
    const messages = ref([])
    const title = ref('')
    const color = ref()
    const hideMenu = ref(false)
    const headerImage = ref({
        src: defaultImage,
        title: 'Michel\'s avatar'
    })
    const headerCover = ref()

    return {
        messages,
        title,
        color,
        hideMenu,
        headerImage,
        headerCover
    };
})