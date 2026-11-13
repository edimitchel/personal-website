import { collectionDefinitions } from '~~/shared/admin/collections'
import { parseDraftFrontmatter, readDraft } from '../../utils/content-drafts'
import { readContentQuery } from '../../utils/admin-request'
import { readPublished } from '../../utils/content-source'
import { publishState } from '../../utils/github-publish'

export default defineEventHandler(async (event) => {
  const target = readContentQuery(event)
  const [published, draft] = await Promise.all([
    readPublished(target.path),
    readDraft(target.collection, target.path),
  ])

  if (!published && !draft) {
    throw createError({ statusCode: 404, statusMessage: 'not-found' })
  }

  return {
    collection: target.collection,
    path: target.path,
    fields: collectionDefinitions[target.collection].fields,
    published,
    draft: draft
      ? {
          frontmatter: parseDraftFrontmatter(draft.frontmatter),
          body: draft.body,
          updatedAt: draft.updatedAt,
        }
      : null,
    publish: publishState(),
  }
})
