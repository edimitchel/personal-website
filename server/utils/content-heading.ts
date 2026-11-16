import { ensureHeading, inspectHeading } from '~~/shared/admin/heading'

export async function prepareDraftContent(body: string, frontmatter: Record<string, unknown>) {
  const heading = await inspectHeading(body)
  const title = heading.title || heading.later || String(frontmatter.title ?? '').trim()
  if (!title) {
    throw createError({ statusCode: 422, statusMessage: 'missing-h1' })
  }

  return {
    title,
    body: await ensureHeading(body, title),
    frontmatter: {
      ...frontmatter,
      title,
    },
  }
}
