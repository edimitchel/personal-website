import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const contentDrafts = sqliteTable('content_drafts', {
  id: text('id').primaryKey(),
  collection: text('collection').notNull(),
  path: text('path').notNull(),
  status: text('status').notNull().default('draft'),
  frontmatter: text('frontmatter').notNull(),
  body: text('body').notNull(),
  updatedAt: integer('updated_at').notNull(),
})
