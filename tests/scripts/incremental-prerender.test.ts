import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  cachedHtmlReferencesValid,
  extractNuxtAssetReferences,
  getOutputFilesForPrerender,
  getPayloadPath,
  getRouteCollectionDeps,
  getRouteContentFiles,
  routeToDefaultFileName,
  shouldFullPrerender,
} from '../../scripts/incremental-prerender-lib'

const contentRoot = join(process.cwd(), 'content')
const publicDir = join(process.cwd(), '.output/public')

describe('incremental prerender helpers', () => {
  it('maps article routes to locale-specific markdown files', () => {
    expect(getRouteContentFiles('/articles/training-nuxt-interactive-platform', contentRoot)).toEqual([
      `${contentRoot}/articles/fr/training-nuxt-interactive-platform.md`,
    ])
    expect(getRouteContentFiles('/en/articles/training-nuxt-interactive-platform', contentRoot)).toEqual([
      `${contentRoot}/articles/training-nuxt-interactive-platform.md`,
    ])
  })

  it('maps listing routes to page content and collections', () => {
    expect(getRouteContentFiles('/articles', contentRoot)).toEqual([
      `${contentRoot}/pages/fr/blog.md`,
    ])
    expect(getRouteCollectionDeps('/articles')).toEqual(['articles', 'pages'])
    expect(getRouteCollectionDeps('/projects/logitud')).toEqual(['projects', 'pages'])
  })

  it('derives payload paths from html output files', () => {
    expect(getPayloadPath('articles/foo.html')).toBe('articles/foo/_payload.json')
    expect(getPayloadPath('articles.html')).toBe('articles/_payload.json')
    expect(getOutputFilesForPrerender('articles/foo.html')).toEqual([
      'articles/foo.html',
      'articles/foo/_payload.json',
    ])
  })

  it('derives default html filenames from routes', () => {
    expect(routeToDefaultFileName('/')).toBe('index.html')
    expect(routeToDefaultFileName('/articles')).toBe('articles.html')
    expect(routeToDefaultFileName('/articles/foo')).toBe('articles/foo.html')
  })

  it('extracts unique /_nuxt references from html', () => {
    const html = '<link href="/_nuxt/entry.ABC.css"><script src="/_nuxt/entry.ABC.css"></script><script src="/_nuxt/app.XYZ.js">'
    expect(extractNuxtAssetReferences(html)).toEqual([
      '/_nuxt/entry.ABC.css',
      '/_nuxt/app.XYZ.js',
    ])
  })
})

describe('shouldFullPrerender', () => {
  it('forces a full rebuild when the shell changed', () => {
    const result = shouldFullPrerender({
      enabled: true,
      manifest: {
        shellHash: 'shell-a',
        assetHash: 'asset-a',
        collections: { articles: 'a', projects: 'p', pages: 'pg' },
        routes: {},
      },
      shellHash: 'shell-b',
    })

    expect(result.full).toBe(true)
    expect(result.shellChanged).toBe(true)
  })

  it('allows incremental rebuild when the shell is unchanged', () => {
    const result = shouldFullPrerender({
      enabled: true,
      manifest: {
        shellHash: 'shell-a',
        assetHash: 'asset-a',
        collections: { articles: 'a', projects: 'p', pages: 'pg' },
        routes: {},
      },
      shellHash: 'shell-a',
    })

    expect(result.full).toBe(false)
    expect(result.shellChanged).toBe(false)
  })
})

describe('cachedHtmlReferencesValid', () => {
  it('accepts cached html when referenced /_nuxt files exist', () => {
    const indexHtml = join(publicDir, 'index.html')
    if (!existsSync(indexHtml)) {
      return
    }

    expect(cachedHtmlReferencesValid(['index.html'], publicDir, publicDir)).toBe(true)
  })

  it('rejects html that references missing /_nuxt files', () => {
    expect(cachedHtmlReferencesValid(
      ['missing.html'],
      publicDir,
      join(process.cwd(), 'tests/fixtures'),
    )).toBe(false)
  })
})