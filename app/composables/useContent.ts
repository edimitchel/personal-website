import type { PageCollectionItemBase } from "@nuxt/content";

export default async function useContent<T extends (PageCollectionItemBase | PageCollectionItemBase[])>(name: string, query: () => Promise<T | null>, hooks?: { onSuccess?: (data: T) => void, onFailure?: () => void }) {
    const { data } = await useAsyncData(
        name,
        query,
        {
            immediate: true
        }
    );

    if (data.value === null) {
        if (import.meta.dev) {
            console.warn('Content Not Found', name)
        }
        return null;
    }

    return data;
}