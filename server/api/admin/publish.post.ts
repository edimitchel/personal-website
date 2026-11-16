import { z } from 'zod'
import { readContentTarget } from '../../utils/admin-request'
import { parseDraftFrontmatter, publishStoredDraft } from '../../utils/content-drafts'
import { getLocales, stemOf } from '../../utils/content-locales'

const publishBody = z.object({
  collection: z.string(),
  path: z.string(),
})

export default defineEventHandler(async (event) => {
  const parsed = publishBody.safeParse(await readBody(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }

  const target = readContentTarget(parsed.data.collection, parsed.data.path)
  const published = await publishStoredDraft(target.collection, target.path)
  if (!published) {
    throw createError({ statusCode: 409, statusMessage: 'no-draft' })
  }

  const frontmatter = parseDraftFrontmatter(published.frontmatter)
  const locales = await getLocales(target.collection, stemOf(target.collection, target.path))
  const current = locales.locales.find(locale => locale.path === target.path)
  if (current && current.state !== 'source' && locales.sourceHash) {
    frontmatter._i18nSourceHash = locales.sourceHash
  }

  return {
    published: true,
    path: target.path,
    updatedAt: published.updatedAt,
  }
})
