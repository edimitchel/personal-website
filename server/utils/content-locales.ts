import { contentCollections, type ContentCollection } from '~~/shared/admin/collections'
import {
  contentLocales,
  fileStemFromPath,
  hashMarkdown,
  isFileStem,
  localeState,
  pathForLocale,
  type ContentLocale,
  type LocaleEntry,
} from '~~/shared/admin/locales'
import { titleFromFrontmatter } from '~~/shared/admin/document'
import { listDrafts, parseDraftFrontmatter, readDraft } from './content-drafts'
import { listPublishedPaths, readContentMarkdown, readPublished, readRawContent } from './content-source'

export async function getLocales(collection: ContentCollection, fileStem: string) {
  if (!isFileStem(fileStem)) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }

  const files = await Promise.all(contentLocales.map(async (locale) => {
    const path = pathForLocale(collection, fileStem, locale)
    const [raw, draft] = await Promise.all([
      readRawContent(path),
      readDraft(collection, path),
    ])
    const storedHash = raw
      ? String(readContentMarkdown(raw).frontmatter._i18nSourceHash ?? '')
      : ''
    return { locale, path, raw, hasDraft: Boolean(draft), storedHash }
  }))

  const source = files.find(file => file.locale === 'en' && file.raw)
    ?? files.find(file => file.raw)
  const sourceLocale: ContentLocale = source?.locale ?? 'en'
  const sourceHash = source?.raw ? await hashMarkdown(source.raw) : ''

  const locales: LocaleEntry[] = files.map(file => ({
    locale: file.locale,
    path: file.path,
    exists: Boolean(file.raw),
    hasDraft: file.hasDraft,
    hash: file.storedHash || null,
    state: localeState({
      locale: file.locale,
      sourceLocale,
      exists: Boolean(file.raw),
      storedHash: file.storedHash,
      sourceHash,
    }),
  }))

  return { fileStem, sourceLocale, sourceHash, locales }
}

export function stemOf(collection: ContentCollection, path: string) {
  return fileStemFromPath(collection, path)
}

export async function translationBoard() {
  const items = []
  for (const collection of contentCollections) {
    const [published, drafts] = await Promise.all([
      listPublishedPaths(collection),
      listDrafts(collection),
    ])
    const stems = [...new Set([...published, ...drafts.map(draft => draft.path)]
      .map(path => fileStemFromPath(collection, path))
      .filter(isFileStem))]

    for (const stem of stems) {
      const info = await getLocales(collection, stem)
      const source = info.locales.find(locale => locale.locale === info.sourceLocale)
      const publishedSource = source?.exists ? await readPublished(source.path) : null
      const draftSource = source ? await readDraft(collection, source.path) : null
      const frontmatter = publishedSource?.frontmatter
        ?? (draftSource ? parseDraftFrontmatter(draftSource.frontmatter) : {})
      const title = titleFromFrontmatter(frontmatter, source?.path ?? stem)
      items.push({
        collection,
        stem,
        title,
        sourceLocale: info.sourceLocale,
        locales: info.locales,
      })
    }
  }

  const count = (state: string) => items.filter(item => item.locales.some(locale => locale.state === state)).length
  return {
    total: items.length,
    missing: count('missing'),
    unstamped: count('unstamped'),
    outdated: count('outdated'),
    done: items.filter(item => item.locales.every(locale => locale.state === 'source' || locale.state === 'current')).length,
    items,
  }
}
