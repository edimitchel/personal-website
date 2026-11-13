import { describe, expect, it } from 'vitest'
import { mergeFrontmatter, splitFrontmatter } from '../../shared/admin/document'
import { inspectHeading } from '../../shared/admin/heading'
import { untranslatedParagraphs, type ProseBlock } from '../../shared/admin/paragraphs'
import { fileStemFromPath, localeState, pathForLocale } from '../../shared/admin/locales'
import { routeContentPath } from '../../shared/site/route-content'
import { isAllowedAdminEmail } from '../../shared/admin/auth'
import { decidePublish, isAdminApiPath, isAdminPath, parseContentPath } from '../../shared/admin/paths'

describe('admin content paths', () => {
  it('accepts a markdown file inside its collection', () => {
    expect(parseContentPath('articles', 'articles/fr/new-website.md')).toEqual({
      ok: true,
      collection: 'articles',
      path: 'articles/fr/new-website.md',
    })
  })

  it('rejects a path that leaves the content tree', () => {
    expect(parseContentPath('articles', 'articles/../../.env').ok).toBe(false)
    expect(parseContentPath('articles', 'projects/logitud.md').ok).toBe(false)
    expect(parseContentPath('notes', 'notes/a.md').ok).toBe(false)
  })

  it('refuses publishing on main and without a token', () => {
    expect(decidePublish({ branch: 'main', token: 'present' })).toBe('refused-branch')
    expect(decidePublish({ branch: 'refs/heads/master', token: 'present' })).toBe('refused-branch')
    expect(decidePublish({ branch: 'content/admin', token: '  ' })).toBe('missing-token')
    expect(decidePublish({ branch: 'content/admin', token: 'present' })).toBe('ok')
  })

  it('recognises admin routes and ignores the public site', () => {
    expect(isAdminPath('/admin')).toBe(true)
    expect(isAdminPath('/admin/articles?x=1')).toBe(true)
    expect(isAdminPath('/en/admin/projects')).toBe(true)
    expect(isAdminPath('/api/admin/drafts')).toBe(true)
    expect(isAdminPath('/')).toBe(false)
    expect(isAdminPath('/articles')).toBe(false)
    expect(isAdminPath('/administration')).toBe(false)
  })

  it('guards admin APIs and leaves the login page to the session redirect', () => {
    expect(isAdminApiPath('/api/admin/drafts')).toBe(true)
    expect(isAdminApiPath('/api/admin/drafts?x=1')).toBe(true)
    expect(isAdminApiPath('/admin/login')).toBe(false)
    expect(isAdminApiPath('/api/preview')).toBe(false)
    expect(isAdminApiPath('/api/admin-auth/providers')).toBe(false)
  })

  it('allows only the configured admin address to create an account', () => {
    expect(isAllowedAdminEmail('Michel@Example.test', 'michel@example.test')).toBe(true)
    expect(isAllowedAdminEmail('other@example.test', 'michel@example.test')).toBe(false)
    expect(isAllowedAdminEmail('michel@example.test', '  ')).toBe(false)
    expect(isAllowedAdminEmail('', 'michel@example.test')).toBe(false)
  })
})

describe('paragraph delta', () => {
  it('marks only the paragraphs added in a section', () => {
    const current: ProseBlock[] = [
      { kind: 'heading', text: 'Titre' },
      { kind: 'paragraph', text: 'Déjà là' },
      { kind: 'paragraph', text: 'Nouveau paragraphe' },
    ]
    const other: ProseBlock[] = [
      { kind: 'heading', text: 'Title' },
      { kind: 'paragraph', text: 'Already there' },
    ]
    expect(untranslatedParagraphs(current, other)).toEqual(['Nouveau paragraphe'])
  })
})

describe('live preview routes', () => {
  it('maps a public page to its content file', () => {
    expect(routeContentPath('/')).toBe('pages/fr/about.md')
    expect(routeContentPath('/en')).toBe('pages/about.md')
    expect(routeContentPath('/articles/new-website')).toBe('articles/fr/new-website.md')
    expect(routeContentPath('/en/projects/logitud')).toBe('projects/logitud.md')
  })
})

describe('content locales', () => {
  it('pairs the same stem in French and English', () => {
    expect(fileStemFromPath('articles', 'articles/fr/new-website.md')).toBe('new-website')
    expect(pathForLocale('articles', 'new-website', 'en')).toBe('articles/new-website.md')
    expect(pathForLocale('articles', 'new-website', 'fr')).toBe('articles/fr/new-website.md')
  })

  it('marks a translation outdated when its source hash differs', () => {
    expect(localeState({
      locale: 'fr',
      sourceLocale: 'en',
      exists: true,
      storedHash: 'old',
      sourceHash: 'new',
    })).toBe('outdated')
    expect(localeState({
      locale: 'fr',
      sourceLocale: 'en',
      exists: true,
      storedHash: 'new',
      sourceHash: 'new',
    })).toBe('current')
    expect(localeState({
      locale: 'en',
      sourceLocale: 'en',
      exists: true,
      sourceHash: 'new',
    })).toBe('source')
    expect(localeState({
      locale: 'fr',
      sourceLocale: 'en',
      exists: false,
      sourceHash: 'new',
    })).toBe('missing')
    expect(localeState({
      locale: 'fr',
      sourceLocale: 'en',
      exists: true,
      storedHash: '',
      sourceHash: 'new',
    })).toBe('unstamped')
  })
})

describe('document title', () => {
  it('reads a leading heading and leaves the rest untouched', async () => {
    const heading = await inspectHeading('# Atom\n\nLe texte.\n')
    expect(heading.title).toBe('Atom')
    expect(heading.rest.startsWith('Le texte.')).toBe(true)
  })

  it('does not invent a title when the first heading is lower in the text', async () => {
    const heading = await inspectHeading('Intro.\n\n# Plus bas\n')
    expect(heading.title).toBe('')
    expect(heading.later).toBe('Plus bas')
  })
})

describe('admin frontmatter merge', () => {
  it('keeps unknown keys and drops empty form fields', () => {
    const split = splitFrontmatter('articles', {
      title: 'Atom',
      translate_state: 'approved',
      categories: ['Outils'],
    })

    expect(split.extras).toEqual({ translate_state: 'approved' })
    expect(split.fields.title).toBe('Atom')
    expect(split.fields.categories).toEqual(['Outils'])

    const merged = mergeFrontmatter('articles', {
      ...split.fields,
      title: 'Atom',
      description: '   ',
      draft: false,
    }, split.extras)

    expect(merged.title).toBe('Atom')
    expect(merged.translate_state).toBe('approved')
    expect(merged.categories).toEqual(['Outils'])
    expect(merged).not.toHaveProperty('description')
    expect(merged).not.toHaveProperty('draft')
  })

  it('stores a numeric duration', () => {
    const merged = mergeFrontmatter('projects', {
      title: 'Logitud',
      duration: '12',
      categories: 'Web\nE-commerce',
    }, {})

    expect(merged.duration).toBe(12)
    expect(merged.categories).toEqual(['Web', 'E-commerce'])
  })
})
