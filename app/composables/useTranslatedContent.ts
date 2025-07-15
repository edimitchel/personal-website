import type { CollectionQueryBuilder, ContentCollectionItem } from "@nuxt/content";

type TranslatedContentData = {
    content: ContentCollectionItem[],
    isTranslated: boolean
}

type SingleContentData = {
    content: ContentCollectionItem,
    isTranslated: boolean
}

// Overload for when transform function is provided
export default async function useTranslatedContent<
    T extends CollectionQueryBuilder<ContentCollectionItem>,
    ResT
>(
    name: string,
    query: T,
    transform: (content: TranslatedContentData) => ResT
): Promise<ResT>

// Overload for when no transform function is provided - returns first content by default
export default async function useTranslatedContent<
    T extends CollectionQueryBuilder<ContentCollectionItem>
>(
    name: string,
    query: T
): Promise<SingleContentData>

// Implementation
export default async function useTranslatedContent<
    T extends CollectionQueryBuilder<ContentCollectionItem>,
    ResT = SingleContentData
>(
    name: string,
    query: T,
    transform?: (content: TranslatedContentData) => ResT
) {
    const { locale } = useI18n()

    const { data } = await useAsyncData(`${name}-${locale.value}`, async () => {
        const contents = await useContent(
            name,
            () => query.all());

        if (!contents?.value) {
            return { content: [], isTranslated: false }
        }

        const currentLanguageContent = contents.value.filter((c) => c.lang === locale.value);

        if (currentLanguageContent.length === 0) {
            return { content: [], isTranslated: false }
        }

        const isTranslated = contents.value.length > 1 && currentLanguageContent.length !== contents.value.length;

        const result = { content: currentLanguageContent, isTranslated }

        // Apply transform function if provided, otherwise return first content by default
        if (transform) {
            return transform(result)
        } else {
            // Default behavior: return first content item
            return {
                content: currentLanguageContent[0],
                isTranslated
            }
        }
    })

    return unref(data);
}