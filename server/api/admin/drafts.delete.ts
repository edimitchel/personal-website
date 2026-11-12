import { deleteDraft } from '../../utils/content-drafts'
import { readContentQuery } from '../../utils/admin-request'

export default defineEventHandler(async (event) => {
  const target = readContentQuery(event)
  await deleteDraft(target.collection, target.path)
  return { ok: true }
})
