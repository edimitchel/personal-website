import { parseContentPath } from '~~/shared/admin/paths'
import { parseDraftFrontmatter, readDraft, readPublishedCopy } from '../utils/content-drafts'
import { isSiteAdmin, previewEnabled } from '../utils/site-admin'

export default defineEventHandler(async (event) => {
  const path = String(getQuery(event).path ?? '')
  const collection = path.split('/')[0] ?? ''
  const target = parseContentPath(collection, path)
  if (!target.ok) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }

  const showDraft = await isSiteAdmin(event) && previewEnabled(event)
  const draft = showDraft ? await readDraft(target.collection, target.path) : null
  const row = draft ?? await readPublishedCopy(target.collection, target.path)
  if (!row) {
    return { source: 'file' as const, markdown: null }
  }

  const frontmatter = parseDraftFrontmatter(row.frontmatter)
  const title = String(frontmatter.title ?? '').trim()
  const markdown = title && !row.body.trimStart().startsWith('# ')
    ? `# ${title}\n\n${row.body}`
    : row.body
  return {
    source: row.status === 'draft' ? 'draft' as const : 'published' as const,
    markdown,
  }
})
