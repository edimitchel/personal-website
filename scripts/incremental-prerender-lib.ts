import { createHash } from 'node:crypto'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { basename, join, relative } from 'node:path'
import type { PrerenderRoute } from 'nitropack'
import { collectPrerenderRoutes } from './collect-prerender-routes'

export const PRERENDER_CACHE_DIR = join(process.cwd(), '.cache/prerender-html')
export const PRERENDER_MANIFEST_PATH = join(process.cwd(), '.cache/prerender-manifest.json')

const SHELL_PATHS = [
  'app',
  'transformers',
  'unocss',
  'locales',
  'content.config.ts',
  'nuxt.config.ts',
] as const

type CollectionName = 'articles' | 'projects' | 'pages'

export interface PrerenderManifest {
  shellHash: string
  collections: Record<CollectionName, string>
  routes: Record<string, { hash: string, files: string[] }>
}

export interface PrerenderPlan {
  allRoutes: string[]
  routesToPrerender: string[]
  routesToRestore: string[]
  shellChanged: boolean
  enabled: boolean
}

function hashContent(value: string) {
  return createHash('sha256').update(value).digest('hex')
}

function hashFile(filePath: string) {
  if (!existsSync(filePath)) {
    return null
  }
  const rel = relative(process.cwd(), filePath)
  return hashContent(`${rel}:${readFileSync(filePath)}`)
}

function walkFiles(dir: string, filter: (path: string) => boolean): string[] {
  if (!existsSync(dir)) {
    return []
  }

  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const entryPath = join(dir, entry)
    const stats = statSync(entryPath)
    if (stats.isDirectory()) {
      files.push(...walkFiles(entryPath, filter))
      continue
    }
    if (filter(entryPath)) {
      files.push(entryPath)
    }
  }
  return files.sort()
}

export function computeShellHash(rootDir = process.cwd()) {
  const parts: string[] = []
  for (const relPath of SHELL_PATHS) {
    const absolutePath = join(rootDir, relPath)
    if (!existsSync(absolutePath)) {
      continue
    }
    const stats = statSync(absolutePath)
    if (stats.isFile()) {
      const hash = hashFile(absolutePath)
      if (hash) {
        parts.push(hash)
      }
      continue
    }
    for (const file of walkFiles(absolutePath, path => /\.(vue|ts|tsx|js|json|css|md)$/.test(path))) {
      const hash = hashFile(file)
      if (hash) {
        parts.push(hash)
      }
    }
  }
  return hashContent(parts.join(':'))
}

export function computeCollectionHash(
  contentRoot: string,
  collection: CollectionName,
) {
  const dir = join(contentRoot, collection)
  const files = walkFiles(dir, path => path.endsWith('.md'))
  const parts = files.map((file) => {
    const rel = relative(process.cwd(), file)
    return `${rel}:${readFileSync(file)}`
  })
  return hashContent(parts.join(':'))
}

export function getRouteContentFiles(route: string, contentRoot: string) {
  const localePrefix = route.startsWith('/en') ? '/en' : ''
  const normalized = localePrefix ? route.slice(3) || '/' : route
  const locale = localePrefix ? 'en' : 'fr'
  const files: string[] = []

  if (normalized === '/') {
    files.push(join(contentRoot, 'pages', locale === 'fr' ? 'fr/about.md' : 'about.md'))
    return files
  }

  if (normalized === '/legal') {
    files.push(join(contentRoot, 'pages', locale === 'fr' ? 'fr/legal.md' : 'legal.md'))
    return files
  }

  if (normalized === '/articles') {
    files.push(join(contentRoot, 'pages', locale === 'fr' ? 'fr/blog.md' : 'blog.md'))
    return files
  }

  if (normalized === '/projects') {
    files.push(join(contentRoot, 'pages', locale === 'fr' ? 'fr/project.md' : 'project.md'))
    return files
  }

  const articleMatch = normalized.match(/^\/articles\/([^/]+)$/)
  if (articleMatch) {
    const slug = articleMatch[1]!
    files.push(join(contentRoot, 'articles', locale === 'fr' ? `fr/${slug}.md` : `${slug}.md`))
    return files
  }

  const projectMatch = normalized.match(/^\/projects\/([^/]+)$/)
  if (projectMatch) {
    const slug = projectMatch[1]!
    files.push(join(contentRoot, 'projects', locale === 'fr' ? `fr/${slug}.md` : `${slug}.md`))
    return files
  }

  return files
}

export function getRouteCollectionDeps(route: string): CollectionName[] {
  const normalized = route.startsWith('/en') ? route.slice(3) || '/' : route

  if (normalized === '/' || normalized === '/projects' || normalized.startsWith('/projects/')) {
    return ['projects', 'pages']
  }

  if (normalized === '/articles' || normalized.startsWith('/articles/')) {
    return ['articles', 'pages']
  }

  if (normalized === '/legal') {
    return ['pages']
  }

  return []
}

export function computeRouteHash(
  route: string,
  contentRoot: string,
  shellHash: string,
  collectionHashes: Record<CollectionName, string>,
) {
  const contentFiles = getRouteContentFiles(route, contentRoot)
  const fileHashes = contentFiles
    .map(file => hashFile(file))
    .filter((hash): hash is string => hash !== null)

  const collectionPart = getRouteCollectionDeps(route)
    .map(name => collectionHashes[name])
    .join(':')

  return hashContent([shellHash, ...fileHashes, collectionPart].join(':'))
}

export function getOutputFilesForPrerender(fileName: string) {
  const files = [fileName]
  const payloadPath = getPayloadPath(fileName)
  if (payloadPath) {
    files.push(payloadPath)
  }
  return files
}

export function getPayloadPath(fileName: string) {
  if (fileName === 'index.html') {
    return '_payload.json'
  }
  if (fileName.endsWith('.html')) {
    return `${fileName.slice(0, -5)}/_payload.json`
  }
  return null
}

export function routeToDefaultFileName(route: string) {
  if (route === '/') {
    return 'index.html'
  }
  const normalized = route.endsWith('/') ? route.slice(0, -1) : route
  return `${normalized.slice(1)}.html`
}

function readManifest(): PrerenderManifest | null {
  if (!existsSync(PRERENDER_MANIFEST_PATH)) {
    return null
  }
  return JSON.parse(readFileSync(PRERENDER_MANIFEST_PATH, 'utf8')) as PrerenderManifest
}

export function isIncrementalPrerenderEnabled() {
  const flag = process.env.INCREMENTAL_PRERENDER?.toLowerCase()
  return flag !== '0' && flag !== 'false'
}

export function createPrerenderPlan(options: {
  contentRoot?: string
  manifest?: PrerenderManifest | null
  enabled?: boolean
  skipCacheFileCheck?: boolean
} = {}): PrerenderPlan {
  const contentRoot = options.contentRoot ?? join(process.cwd(), 'content')
  const enabled = options.enabled ?? isIncrementalPrerenderEnabled()
  const allRoutes = collectPrerenderRoutes(contentRoot)
  const shellHash = computeShellHash()
  const collectionHashes: Record<CollectionName, string> = {
    articles: computeCollectionHash(contentRoot, 'articles'),
    projects: computeCollectionHash(contentRoot, 'projects'),
    pages: computeCollectionHash(contentRoot, 'pages'),
  }

  const manifest = options.manifest === undefined ? readManifest() : options.manifest

  if (!enabled || !manifest || manifest.shellHash !== shellHash) {
    return {
      allRoutes,
      routesToPrerender: allRoutes,
      routesToRestore: [],
      shellChanged: !manifest || manifest.shellHash !== shellHash,
      enabled,
    }
  }

  const routesToPrerender: string[] = []
  const routesToRestore: string[] = []

  for (const route of allRoutes) {
    const routeHash = computeRouteHash(route, contentRoot, shellHash, collectionHashes)
    const cached = manifest.routes[route]
    const cacheExists = options.skipCacheFileCheck
      || cached?.files.every(file => existsSync(join(PRERENDER_CACHE_DIR, file)))

    if (!cached || cached.hash !== routeHash || !cacheExists) {
      routesToPrerender.push(route)
    }
    else {
      routesToRestore.push(route)
    }
  }

  return {
    allRoutes,
    routesToPrerender,
    routesToRestore,
    shellChanged: false,
    enabled,
  }
}

function ensureDir(path: string) {
  mkdirSync(path, { recursive: true })
}

export function savePrerenderedRoutes(
  routes: PrerenderRoute[],
  publicDir: string,
  options: {
    contentRoot?: string
    resetManifest?: boolean
  } = {},
) {
  const contentRoot = options.contentRoot ?? join(process.cwd(), 'content')
  ensureDir(PRERENDER_CACHE_DIR)

  const shellHash = computeShellHash()
  const collectionHashes: Record<CollectionName, string> = {
    articles: computeCollectionHash(contentRoot, 'articles'),
    projects: computeCollectionHash(contentRoot, 'projects'),
    pages: computeCollectionHash(contentRoot, 'pages'),
  }

  const existingManifest = readManifest()
  const manifest: PrerenderManifest = options.resetManifest || !existingManifest
    ? { shellHash, collections: collectionHashes, routes: {} }
    : existingManifest

  manifest.shellHash = shellHash
  manifest.collections = collectionHashes

  for (const route of routes) {
    if (!route.fileName || route.skip || route.error) {
      continue
    }

    const outputFiles = getOutputFilesForPrerender(route.fileName)
    const cachedFiles: string[] = []

    for (const file of outputFiles) {
      const source = join(publicDir, file)
      if (!existsSync(source)) {
        continue
      }
      const destination = join(PRERENDER_CACHE_DIR, file)
      ensureDir(join(destination, '..'))
      cpSync(source, destination)
      cachedFiles.push(file)
    }

    if (cachedFiles.length === 0) {
      continue
    }

    manifest.routes[route.route] = {
      hash: computeRouteHash(route.route, contentRoot, shellHash, collectionHashes),
      files: cachedFiles,
    }
  }

  const validRoutes = new Set(collectPrerenderRoutes(contentRoot))
  for (const route of Object.keys(manifest.routes)) {
    if (!validRoutes.has(route)) {
      delete manifest.routes[route]
    }
  }

  ensureDir(join(PRERENDER_MANIFEST_PATH, '..'))
  writeFileSync(PRERENDER_MANIFEST_PATH, JSON.stringify(manifest, null, 2))
}

export function restoreCachedRoutes(
  routes: string[],
  publicDir: string,
  manifest = readManifest(),
) {
  if (!manifest) {
    return 0
  }

  let restored = 0

  for (const route of routes) {
    const cached = manifest.routes[route]
    if (!cached) {
      continue
    }

    for (const file of cached.files) {
      const source = join(PRERENDER_CACHE_DIR, file)
      const destination = join(publicDir, file)
      if (!existsSync(source)) {
        continue
      }
      ensureDir(join(destination, '..'))
      cpSync(source, destination)
      restored++
    }
  }

  return restored
}

export function logPrerenderPlan(plan: PrerenderPlan) {
  if (!plan.enabled) {
    console.log('[prerender] incremental cache disabled — full prerender')
    return
  }

  if (plan.shellChanged) {
    console.log('[prerender] app shell changed — full prerender')
    return
  }

  console.log(
    `[prerender] incremental: ${plan.routesToPrerender.length} to build, ${plan.routesToRestore.length} from cache`,
  )
}
