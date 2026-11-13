import { and, eq, sql } from 'drizzle-orm'
import { db } from '@nuxthub/db'
import { contentDrafts } from '../db/schema'
import type { ContentCollection } from '~~/shared/admin/collections'

let ensuring: Promise<void> | undefined

export function ensureDraftsTable() {
  if (!ensuring) {
    ensuring = (async () => {
      await db.run(sql.raw(`CREATE TABLE IF NOT EXISTS content_drafts (
        id TEXT PRIMARY KEY NOT NULL,
        collection TEXT NOT NULL,
        path TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        frontmatter TEXT NOT NULL,
        body TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      )`))
      try {
        await db.run(sql.raw(`ALTER TABLE content_drafts ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'`))
      }
      catch {
        // The column is already there.
      }
      await db.run(sql.raw('DROP INDEX IF EXISTS content_drafts_collection_path'))
      await db.run(sql.raw(
        'CREATE UNIQUE INDEX IF NOT EXISTS content_drafts_collection_path_status ON content_drafts (collection, path, status)',
      ))
    })().catch((error: unknown) => {
      ensuring = undefined
      throw error
    })
  }
  return ensuring
}

function draftId(collection: ContentCollection, path: string) {
  return `${collection}:${path}`
}

export async function listDrafts(collection: ContentCollection) {
  await ensureDraftsTable()
  return db.select().from(contentDrafts).where(and(
    eq(contentDrafts.collection, collection),
    eq(contentDrafts.status, 'draft'),
  ))
}

export async function readDraft(collection: ContentCollection, path: string) {
  return readStored(collection, path, 'draft')
}

export async function readPublishedCopy(collection: ContentCollection, path: string) {
  return readStored(collection, path, 'published')
}

async function readStored(collection: ContentCollection, path: string, status: 'draft' | 'published') {
  await ensureDraftsTable()
  const rows = await db.select().from(contentDrafts).where(and(
    eq(contentDrafts.collection, collection),
    eq(contentDrafts.path, path),
    eq(contentDrafts.status, status),
  )).limit(1)
  return rows[0] ?? null
}

export async function saveDraft(input: {
  collection: ContentCollection
  path: string
  frontmatter: Record<string, unknown>
  body: string
}) {
  await ensureDraftsTable()
  const row = {
    id: draftId(input.collection, input.path),
    collection: input.collection,
    path: input.path,
    status: 'draft',
    frontmatter: JSON.stringify(input.frontmatter),
    body: input.body,
    updatedAt: Date.now(),
  }
  await db.insert(contentDrafts).values(row).onConflictDoUpdate({
    target: contentDrafts.id,
    set: {
      frontmatter: row.frontmatter,
      body: row.body,
      updatedAt: row.updatedAt,
    },
  })
  return row
}

export async function publishStoredDraft(collection: ContentCollection, path: string) {
  const draft = await readDraft(collection, path)
  if (!draft) {
    return null
  }
  await ensureDraftsTable()
  const row = {
    id: `${collection}:${path}:published`,
    collection,
    path,
    status: 'published',
    frontmatter: draft.frontmatter,
    body: draft.body,
    updatedAt: Date.now(),
  }
  await db.insert(contentDrafts).values(row).onConflictDoUpdate({
    target: contentDrafts.id,
    set: {
      frontmatter: row.frontmatter,
      body: row.body,
      updatedAt: row.updatedAt,
      status: 'published',
    },
  })
  return row
}

export async function deleteDraft(collection: ContentCollection, path: string) {
  await ensureDraftsTable()
  await db.delete(contentDrafts).where(and(
    eq(contentDrafts.collection, collection),
    eq(contentDrafts.path, path),
    eq(contentDrafts.status, 'draft'),
  ))
}

export function parseDraftFrontmatter(raw: string) {
  const parsed = JSON.parse(raw) as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {}
  }
  return parsed as Record<string, unknown>
}
