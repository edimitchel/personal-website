import type { ContentCollection } from './collections'

export const contentLocales = ['fr', 'en'] as const

export type ContentLocale = typeof contentLocales[number]

export type LocaleState = 'source' | 'current' | 'missing' | 'outdated' | 'unstamped'

export type LocaleEntry = {
  locale: ContentLocale
  path: string
  exists: boolean
  hasDraft: boolean
  hash: string | null
  state: LocaleState
}

export function fileStemFromPath(collection: ContentCollection, path: string) {
  const relative = path.slice(collection.length + 1).replace(/\.md$/, '')
  return relative.replace(/^fr\//, '')
}

export function pathForLocale(collection: ContentCollection, fileStem: string, locale: ContentLocale) {
  return locale === 'fr'
    ? `${collection}/fr/${fileStem}.md`
    : `${collection}/${fileStem}.md`
}

export function isFileStem(value: string) {
  return /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(value)
}

export function localeState(input: {
  locale: ContentLocale
  sourceLocale: ContentLocale
  exists: boolean
  storedHash?: string | null
  sourceHash: string
}): LocaleState {
  if (input.locale === input.sourceLocale) {
    return 'source'
  }
  if (!input.exists) {
    return 'missing'
  }
  if (!input.storedHash) {
    return 'unstamped'
  }
  if (input.storedHash === input.sourceHash) {
    return 'current'
  }
  return 'outdated'
}

export async function hashMarkdown(markdown: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(markdown))
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, '0')).join('')
}
