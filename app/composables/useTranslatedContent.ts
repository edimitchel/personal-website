import type { CollectionQueryBuilder, PagesCollectionItem } from "@nuxt/content";

type TranslatedContentData<T extends PagesCollectionItem = PagesCollectionItem> = {
    content: T[],
    isTranslated: boolean
}

type SingleContentData<T extends PagesCollectionItem = PagesCollectionItem> = {
    content: T,
    isTranslated: boolean
}

// Overload for when transform function is provided
export default async function useTranslatedContent<
    T extends CollectionQueryBuilder<PagesCollectionItem>,
    ResT,
    ContentT extends PagesCollectionItem = T extends CollectionQueryBuilder<infer U> ? U : PagesCollectionItem
>(
    name: string,
    query: T,
    transform: (content: TranslatedContentData<ContentT>) => ResT
): Promise<ResT>

// Overload for when no transform function is provided - returns first content by default
export default async function useTranslatedContent<
    T extends CollectionQueryBuilder<PagesCollectionItem>,
    ContentT extends PagesCollectionItem = T extends CollectionQueryBuilder<infer U> ? U : PagesCollectionItem
>(
    name: string,
    query: T
): Promise<SingleContentData<ContentT>>

// Implementation
export default async function useTranslatedContent<
    T extends CollectionQueryBuilder<PagesCollectionItem>,
    ResT = SingleContentData,
    ContentT extends PagesCollectionItem = T extends CollectionQueryBuilder<infer U> ? U : PagesCollectionItem
>(
    name: string,
    query: T,
    transform?: (content: TranslatedContentData<ContentT>) => ResT
) {
    const { locale } = useI18n()

    const { data } = await useAsyncData(`${name}-${locale.value}`, async (nuxtApp) => {
        // The collection already returns the active locale and falls back to English.
        const contents = await query.all()

        if (!contents?.length) {
            return { content: null, isTranslated: false }
        }

        const result = { content: contents as ContentT[], isTranslated: false }

        if (transform) {
            return transform(result)
        }

        const item = contents[0] as ContentT
        const collection = String(item.stem ?? '').split('/')[0]
        let isTranslated = false
        if (collection === 'pages' || collection === 'articles' || collection === 'projects') {
            const locales = await nuxtApp.runWithContext(() => queryCollectionLocales(collection, String(item.stem)))
            isTranslated = locales.some(entry => entry.locale !== locale.value)
        }

        return {
            content: item,
            isTranslated,
        }
    }, {
        default() {
            return {
                content: null,
                isTranslated: false
            }
        }
    })

    return unref(data);
}