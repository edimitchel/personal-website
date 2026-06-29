import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  getOutputFilesForPrerender,
  getPayloadPath,
  getRouteCollectionDeps,
  getRouteContentFiles,
  routeToDefaultFileName,
} from '../../scripts/incremental-prerender-lib'

const contentRoot = join(process.cwd(), 'content')

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
})
