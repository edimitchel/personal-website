export async function useContentHreflang(collection: 'articles' | 'projects', contentStem: string) {
  const nuxtApp = useNuxtApp()
  const origin = useSiteConfig().url.replace(/\/$/, '')
  const englishQuery = queryCollection(collection).locale('en').stem(contentStem).select('slug')
  const frenchQuery = queryCollection(collection).locale('fr').stem(contentStem).select('slug')
  const [english, french] = await Promise.all([
    englishQuery.first(),
    frenchQuery.first(),
  ])
  const prefix = collection === 'articles' ? '/articles' : '/projects'
  const links = [
    english?.slug ? { locale: 'en', slug: String(english.slug) } : null,
    french?.slug ? { locale: 'fr', slug: String(french.slug) } : null,
  ].filter(item => item !== null)

  nuxtApp.runWithContext(() => {
    useHead({
      link: links.map((item) => {
        const href = item.locale === 'en'
          ? `${origin}/en${prefix}/${item.slug}`
          : `${origin}${prefix}/${item.slug}`
        return { rel: 'alternate', hreflang: item.locale, href }
      }),
    })
  })
}
