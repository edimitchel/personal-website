import { z } from 'zod'
import { readContentTarget } from '../../utils/admin-request'
import { saveDraft } from '../../utils/content-drafts'
import { prepareDraftContent } from '../../utils/content-heading'

const draftBody = z.object({
  collection: z.string(),
  path: z.string(),
  frontmatter: z.record(z.string(), z.unknown()),
  body: z.string().max(500_000),
})

export default defineEventHandler(async (event) => {
  const parsed = await readValidatedBody(event, draftBody.safeParse)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'draft' })
  }

  const target = readContentTarget(parsed.data.collection, parsed.data.path)
  const prepared = await prepareDraftContent(parsed.data.body, parsed.data.frontmatter)
  const saved = await saveDraft({
    collection: target.collection,
    path: target.path,
    frontmatter: prepared.frontmatter,
    body: prepared.body,
  })

  return {
    path: saved.path,
    updatedAt: saved.updatedAt,
  }
})
