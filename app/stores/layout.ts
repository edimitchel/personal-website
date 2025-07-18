import defaultImage from '~/assets/images/self-image.jpeg'

export type State = {
    messages: string[],
    title: string
    color?: string[],
    hideMenu: boolean,
    withEmoji: boolean,
    headerImage: {
        src: string,
        title: string,
    },
    headerCover?: {
        src: string,
        nudge?: {y?: number, x?: number}
    },
    notTranslated?: boolean
}

export type MessageObject = { content: string, level: number };

export const layoutStore = defineStore('layout', () => {
    const messages = ref<(string | MessageObject)[]>([])
    const title = ref('')
    const color = ref()
    const hideMenu = ref(false)
    const withEmoji = ref(false)
    const headerImage = ref<{ src: string, title: string } | undefined>()
    const headerCover = ref<{ src: string, nudge?: {y?: number, x?: number} } | undefined>(undefined)
    const notTranslated = ref<boolean | undefined>(undefined)

    function resetTitle() {
        title.value = '';
    }

    function setDefaultHeaderImage() {
        headerImage.value = {
            src: defaultImage,
            title: 'Michel\'s picture'
        }
    }

    setDefaultHeaderImage();

    return {
        messages,
        title,
        color,
        hideMenu,
        withEmoji,
        headerImage,
        headerCover,
        notTranslated,
        setDefaultHeaderImage,
    };
})