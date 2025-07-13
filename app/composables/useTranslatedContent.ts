import type { CollectionItemBase, CollectionQueryBuilder, ContentCollectionItem, PageCollectionItemBase } from "@nuxt/content";

export default async function useTranslatedContent<T extends CollectionQueryBuilder<ContentCollectionItem>>(name: string, query: T) {
    const { locale } = useI18n()
    const contents = await useContent(
        `${name}-${locale.value}`,
        () => query.all());

    if (!contents?.value) {
        return { content: null, isTranslated: false }
    }

    const content = contents.value.filter((c) => c.lang === locale.value)[0]!;
    const isTranslated = contents.value.length > 1;
    return { content, isTranslated }
}