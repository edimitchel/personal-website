CREATE TABLE IF NOT EXISTS content_drafts (
  id TEXT PRIMARY KEY NOT NULL,
  collection TEXT NOT NULL,
  path TEXT NOT NULL,
  frontmatter TEXT NOT NULL,
  body TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS content_drafts_collection_path_status ON content_drafts (collection, path, status);
