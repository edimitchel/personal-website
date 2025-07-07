import type { PageCollectionItemBase } from "@nuxt/content";

export default async function useContent<T extends (PageCollectionItemBase | PageCollectionItemBase[])>(name: string, query: () => Promise<T | null>, hooks?: {onSuccess?: (data: T) => void, onFailure?: () => void}) {
    const data = useState<T | null>(name, () => null);

    const result = await query()
    if (result === null && !hooks?.onFailure) {
        console.warn('Content Not Found', name)
        return null;
    } else if (result === null) {
        hooks?.onFailure?.()
        return data
    }

    data.value = result;

    hooks?.onSuccess?.(result)

    return data;
}