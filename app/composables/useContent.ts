import type { PageCollectionItemBase } from "@nuxt/content";

export default async function useContent<T extends (PageCollectionItemBase | PageCollectionItemBase[])>(name: string, query: () => Promise<T | null>, hooks?: {onSuccess?: (data: T) => void, onFailure?: () => void}) {
    const data = useState<T | null>(name, () => null);

    const result = await query()

    if (!result && !hooks?.onFailure) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found'
        })
    } else if (!result) {
        hooks?.onFailure?.()
        return data
    }

    data.value = result;

    hooks?.onSuccess?.(result)

    return data;
}