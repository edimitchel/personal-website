import { isContentCollection } from '~~/shared/admin/collections'
import { titleFromFrontmatter } from '~~/shared/admin/document'
import { fileStemFromPath, isFileStem } from '~~/shared/admin/locales'
import { getLocales } from '../../utils/content-locales'
import { listDrafts, parseDraftFrontmatter } from '../../utils/content-drafts'
import { listPublishedPaths, readPublished } from '../../utils/content-source'
import { publishState } from '../../utils/github-publish'

export default defineEventHandler(async (event) => {
  const collection = String(getQuery(event).collection ?? '')
  if (!isContentCollection(collection)) {
    throw createError({ statusCode: 400, statusMessage: 'collection' })
  }

  const [published, drafts] = await Promise.all([
    listPublishedPaths(collection),
    listDrafts(collection),
  ])
  const draftByPath = new Map(drafts.map(draft => [draft.path, draft]))
  const paths = [...new Set([...published, ...drafts.map(draft => draft.path)])].sort()
  const localeCache = new Map<string, { locale: string, state: string }[]>()

  const entries = await Promise.all(paths.map(async (path) => {
    const draft = draftByPath.get(path)
    const fallback = path.split('/').at(-1) ?? path
    let title: string
    if (draft) {
      try {
        title = titleFromFrontmatter(parseDraftFrontmatter(draft.frontmatter), path)
      }
      catch {
        title = fallback
      }
    }
    else {
      const document = await readPublished(path)
      title = titleFromFrontmatter(document?.frontmatter ?? {}, path)
    }
    const stem = fileStemFromPath(collection, path)
    let locales: { locale: string, state: string }[] = []
    if (isFileStem(stem)) {
      if (!localeCache.has(stem)) {
        const info = await getLocales(collection, stem)
        localeCache.set(stem, info.locales.map(locale => ({
          locale: locale.locale,
          state: locale.state,
        })))
      }
      locales = localeCache.get(stem) ?? []
    }
    return {
      path,
      title,
      hasDraft: Boolean(draft),
      hasPublished: published.includes(path),
      locales,
    }
  }))

  return {
    collection,
    entries,
    publish: publishState(),
  }
})
