import type { PageCollectionItemBase } from "@nuxt/content";

export default async function useContent<T extends PageCollectionItemBase>(name: string, query: () => Promise<T | null>, onSuccess?: (data: T) => void) {
    const data = useState<T | null>(name, () => null);

    const result = await query()

    if (!result) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Not Found'
        })
    }

    data.value = result;

    onSuccess?.(result)

    return data;
}