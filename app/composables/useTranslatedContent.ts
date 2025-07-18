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

    const { data } = await useAsyncData(`${name}-${locale.value}`, async () => {
        const contents = await useContent(
            name,
            () => query.all()
        );

        if (!contents?.value) {
            return { content: null, isTranslated: false }
        }

        const currentLanguageContent = contents.value.filter((c) => c.lang === locale.value);

        const isTranslated = contents.value.length > 1 || currentLanguageContent.length !== contents.value.length;

        if (currentLanguageContent.length === 0) {
            return { content: null, isTranslated }
        }

        const result = { content: currentLanguageContent as ContentT[], isTranslated }

        // Apply transform function if provided, otherwise return first content by default
        if (transform) {
            return transform(result)
        } else {
            // Default behavior: return first content item
            return {
                content: currentLanguageContent[0] as ContentT,
                isTranslated
            }
        }
    })

    return unref(data);
}