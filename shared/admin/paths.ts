import { isContentCollection, type ContentCollection } from './collections'

const PATH_PATTERN = /^(pages|articles|projects)\/(?:[A-Za-z0-9][A-Za-z0-9_-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.md$/

const BLOCKED_BRANCHES = new Set(['main', 'master', 'refs/heads/main', 'refs/heads/master'])

export type PublishDecision = 'ok' | 'refused-branch' | 'missing-token'

export function parseContentPath(collection: string, path: string):
  | { ok: true, collection: ContentCollection, path: string }
  | { ok: false, reason: 'collection' | 'path' } {
  if (!isContentCollection(collection)) {
    return { ok: false, reason: 'collection' }
  }

  const normalized = path.trim().replace(/^\/+/, '')
  if (
    !PATH_PATTERN.test(normalized)
    || normalized.includes('..')
    || normalized.includes('\\')
    || normalized.includes('//')
    || !normalized.startsWith(`${collection}/`)
  ) {
    return { ok: false, reason: 'path' }
  }

  return { ok: true, collection, path: normalized }
}

export function decidePublish(input: { branch: string, token: string }): PublishDecision {
  const branch = input.branch.trim()
  if (
    !branch
    || BLOCKED_BRANCHES.has(branch.toLowerCase())
    || !/^[A-Za-z0-9._/-]+$/.test(branch)
    || branch.startsWith('/')
    || branch.endsWith('/')
    || branch.includes('..')
  ) {
    return 'refused-branch'
  }
  if (!input.token.trim()) {
    return 'missing-token'
  }
  return 'ok'
}

export function isAdminPath(path: string) {
  const bare = (path.split('?')[0] ?? '').replace(/\/+$/, '') || '/'
  return bare === '/admin'
    || bare.startsWith('/admin/')
    || bare === '/en/admin'
    || bare.startsWith('/en/admin/')
    || bare === '/api/admin'
    || bare.startsWith('/api/admin/')
}
