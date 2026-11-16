import { z } from 'zod'
import { translateMarkdown } from '../../utils/translation'

const bodySchema = z.object({
  text: z.string().min(1).max(8_000),
  sourceLocale: z.enum(['fr', 'en']),
  targetLocale: z.enum(['fr', 'en']),
})

export default defineEventHandler(async (event) => {
  const parsed = await readValidatedBody(event, bodySchema.safeParse)
  if (!parsed.success || parsed.data.sourceLocale === parsed.data.targetLocale) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }

  const suggestion = await translateMarkdown({
    sourceLocale: parsed.data.sourceLocale,
    targetLocale: parsed.data.targetLocale,
    markdown: parsed.data.text,
  })

  return { suggestion: suggestion.trim() }
})
