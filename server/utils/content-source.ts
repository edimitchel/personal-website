import { readdir, readFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'
import matter from 'gray-matter'
import type { ContentCollection } from '~~/shared/admin/collections'
import { normalizeFrontmatter } from '~~/shared/admin/document'

const contentRoot = resolve(process.cwd(), 'content')

function absoluteContentFile(relativePath: string) {
  const full = resolve(contentRoot, relativePath)
  if (full !== contentRoot && !full.startsWith(`${contentRoot}${sep}`)) {
    throw createError({ statusCode: 400, statusMessage: 'path' })
  }
  return full
}

export async function listPublishedPaths(collection: ContentCollection) {
  const files: string[] = []

  async function walk(current: string) {
    let entries
    try {
      entries = await readdir(current, { withFileTypes: true })
    }
    catch {
      return
    }
    for (const entry of entries) {
      const next = join(current, entry.name)
      if (entry.isDirectory()) {
        await walk(next)
      }
      else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(relative(contentRoot, next).split(sep).join('/'))
      }
    }
  }

  await walk(join(contentRoot, collection))
  return files.sort()
}

export function readContentMarkdown(raw: string) {
  const parsed = matter(raw)
  return {
    frontmatter: normalizeFrontmatter(parsed.data) as Record<string, unknown>,
    body: parsed.content.replace(/^\n/, ''),
  }
}

export function writeContentMarkdown(frontmatter: Record<string, unknown>, body: string) {
  const cleaned = Object.fromEntries(
    Object.entries(frontmatter).filter(([, value]) => value !== undefined),
  )
  if (!Object.keys(cleaned).length) {
    return body.endsWith('\n') ? body : `${body}\n`
  }
  return matter.stringify(body, cleaned)
}

export async function readRawContent(relativePath: string) {
  try {
    return await readFile(absoluteContentFile(relativePath), 'utf8')
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw error
  }
}

export async function readPublished(relativePath: string) {
  try {
    const raw = await readRawContent(relativePath)
    return raw === null ? null : readContentMarkdown(raw)
  }
  catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null
    }
    throw error
  }
}
