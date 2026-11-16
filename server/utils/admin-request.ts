import { z } from 'zod'
import { parseContentPath } from '~~/shared/admin/paths'

const pathQuery = z.object({
  collection: z.string(),
  path: z.string(),
})

export function readContentTarget(collection: string, path: string) {
  const parsed = parseContentPath(collection, path)
  if (!parsed.ok) {
    throw createError({ statusCode: 400, statusMessage: parsed.reason })
  }
  return parsed
}

export function readContentQuery(event: Parameters<typeof getQuery>[0]) {
  const query = pathQuery.safeParse(getQuery(event))
  if (!query.success) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }
  return readContentTarget(query.data.collection, query.data.path)
}
