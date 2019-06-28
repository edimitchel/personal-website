export default async (typeId, { api, version }) => {
    const type = await api.get(
            `cdn/stories/${typeId}`,
            {
                version
            }
        )
        .then(({ data }) => data)
        .then(({ story }) => story)
        .catch(err => console.error(err))
    if(!type) {
        return {}
    }

    const { title } = type.content;

    return {
        name: title,
        slug: type.slug
    }
}