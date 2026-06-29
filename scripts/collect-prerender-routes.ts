import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, join } from 'node:path'
import matter from 'gray-matter'

type Locale = 'fr' | 'en'

function slugFromFile(filePath: string, fallback: string) {
  const { data } = matter(readFileSync(filePath, 'utf8'))
  return (data.slug as string | undefined) ?? fallback
}

function collectLocalizedSlugs(contentRoot: string, collection: 'articles' | 'projects') {
  const slugsByLocale = new Map<Locale, Set<string>>()

  const add = (locale: Locale, slug: string) => {
    if (!slugsByLocale.has(locale)) {
      slugsByLocale.set(locale, new Set())
    }
    slugsByLocale.get(locale)!.add(slug)
  }

  const baseDir = join(contentRoot, collection)

  if (existsSync(baseDir)) {
    for (const entry of readdirSync(baseDir)) {
      const entryPath = join(baseDir, entry)
      if (entry === 'fr' || !entry.endsWith('.md') || !statSync(entryPath).isFile()) {
        continue
      }
      add('en', slugFromFile(entryPath, basename(entry, '.md')))
    }
  }

  const frDir = join(baseDir, 'fr')
  if (existsSync(frDir)) {
    for (const entry of readdirSync(frDir)) {
      if (!entry.endsWith('.md')) {
        continue
      }
      const entryPath = join(frDir, entry)
      if (!statSync(entryPath).isFile()) {
        continue
      }
      add('fr', slugFromFile(entryPath, basename(entry, '.md')))
    }
  }

  return slugsByLocale
}

function toRoutes(slugsByLocale: Map<Locale, Set<string>>, collection: 'articles' | 'projects') {
  const routes = new Set<string>([`/${collection}`, '/en/' + collection])

  for (const slug of slugsByLocale.get('fr') ?? []) {
    routes.add(`/${collection}/${slug}`)
  }

  for (const slug of slugsByLocale.get('en') ?? []) {
    routes.add(`/en/${collection}/${slug}`)
  }

  return [...routes]
}

export function collectPrerenderRoutes(contentRoot = join(process.cwd(), 'content')) {
  const routes = new Set<string>([
    '/',
    '/projects',
    '/articles',
    '/legal',
    '/en',
    '/en/projects',
    '/en/articles',
    '/en/legal',
  ])

  for (const collection of ['articles', 'projects'] as const) {
    for (const route of toRoutes(collectLocalizedSlugs(contentRoot, collection), collection)) {
      routes.add(route)
    }
  }

  return [...routes]
}