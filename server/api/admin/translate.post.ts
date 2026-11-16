import { z } from 'zod'
import { isContentCollection } from '~~/shared/admin/collections'
import { isFileStem, pathForLocale, type ContentLocale } from '~~/shared/admin/locales'
import { saveDraft } from '../../utils/content-drafts'
import { getLocales } from '../../utils/content-locales'
import { readRawContent } from '../../utils/content-source'
import { draftFromTranslation, translateMarkdown } from '../../utils/translation'

const bodySchema = z.object({
  collection: z.string(),
  stem: z.string(),
  targetLocale: z.enum(['fr', 'en']),
})

export default defineEventHandler(async (event) => {
  const parsed = await readValidatedBody(event, bodySchema.safeParse)
  if (!parsed.success || !isContentCollection(parsed.data.collection) || !isFileStem(parsed.data.stem)) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }

  const { collection, stem, targetLocale } = parsed.data
  const locales = await getLocales(collection, stem)
  const source = locales.locales.find(locale => locale.locale === locales.sourceLocale)
  if (!source?.exists) {
    throw createError({ statusCode: 404, statusMessage: 'not-found' })
  }
  if (targetLocale === locales.sourceLocale) {
    throw createError({ statusCode: 409, statusMessage: 'source' })
  }

  const raw = await readRawContent(source.path)
  if (!raw) {
    throw createError({ statusCode: 404, statusMessage: 'not-found' })
  }

  const translated = await translateMarkdown({
    sourceLocale: locales.sourceLocale,
    targetLocale: targetLocale as ContentLocale,
    markdown: raw,
  })
  const draft = draftFromTranslation(raw, translated)
  const path = pathForLocale(collection, stem, targetLocale)
  const saved = await saveDraft({
    collection,
    path,
    frontmatter: draft.frontmatter,
    body: draft.body,
  })

  return {
    path: saved.path,
    updatedAt: saved.updatedAt,
  }
})
