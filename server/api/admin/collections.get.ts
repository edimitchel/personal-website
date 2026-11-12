import { contentCollections } from '~~/shared/admin/collections'
import { listDrafts } from '../../utils/content-drafts'
import { listPublishedPaths } from '../../utils/content-source'
import { publishState } from '../../utils/github-publish'

export default defineEventHandler(async () => {
  const collections = await Promise.all(contentCollections.map(async (id) => {
    const [published, drafts] = await Promise.all([
      listPublishedPaths(id),
      listDrafts(id),
    ])
    const paths = new Set([...published, ...drafts.map(draft => draft.path)])
    return {
      id,
      count: paths.size,
      drafts: drafts.length,
    }
  }))

  return {
    collections,
    publish: publishState(),
  }
})
