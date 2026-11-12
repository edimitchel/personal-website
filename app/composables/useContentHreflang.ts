export async function useContentHreflang(collection: 'articles' | 'projects', contentStem: string) {
  const normalized = contentStem.split('/').filter(part => part !== collection && part !== 'fr').join('/')
  const items = await queryCollection(collection)
    .where('stem', 'IN', [`${collection}/${normalized}`, `${collection}/fr/${normalized}`])
    .all()
  const origin = useSiteConfig().url.replace(/\/$/, '')
  const prefix = collection === 'articles' ? '/articles' : '/projects'

  useHead({
    link: items.flatMap((item) => {
      const locale = String(item.stem).includes('/fr/') ? 'fr' : 'en'
      const slug = String(item.slug ?? normalized)
      const href = locale === 'en'
        ? `${origin}/en${prefix}/${slug}`
        : `${origin}${prefix}/${slug}`
      return [{ rel: 'alternate', hreflang: locale, href }]
    }),
  })
}
