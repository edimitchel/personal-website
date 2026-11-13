export const contentCollections = ['pages', 'articles', 'projects'] as const

export type ContentCollection = typeof contentCollections[number]

export const projectTypes = ['application', 'website', 'consulting', 'experience', 'static'] as const

export const projectStatuses = ['published', 'draft', 'stand by', 'completed', 'closed', 'private'] as const

export type FieldKind = 'string' | 'text' | 'boolean' | 'list' | 'enum' | 'date'

export type ContentField = {
  key: string
  labelKey: string
  kind: FieldKind
  options?: readonly string[]
  /** Shown first. The other fields stay behind “Détails”. */
  primary?: boolean
}

export type CollectionDefinition = {
  id: ContentCollection
  labelKey: string
  fields: ContentField[]
}

const pageFields: ContentField[] = [
  { key: 'title', labelKey: 'admin.fields.title', kind: 'string', primary: true },
  { key: 'description', labelKey: 'admin.fields.description', kind: 'text', primary: true },
  { key: 'name', labelKey: 'admin.fields.name', kind: 'string' },
  { key: 'slug', labelKey: 'admin.fields.slug', kind: 'string' },
  { key: 'lang', labelKey: 'admin.fields.lang', kind: 'enum', options: ['fr', 'en'] },
  { key: 'draft', labelKey: 'admin.fields.draft', kind: 'boolean' },
]

const articleFields: ContentField[] = [
  { key: 'title', labelKey: 'admin.fields.title', kind: 'string', primary: true },
  { key: 'description', labelKey: 'admin.fields.description', kind: 'text', primary: true },
  { key: 'categories', labelKey: 'admin.fields.categories', kind: 'list', primary: true },
  { key: 'tags', labelKey: 'admin.fields.tags', kind: 'list', primary: true },
  { key: 'slug', labelKey: 'admin.fields.slug', kind: 'string' },
  { key: 'author', labelKey: 'admin.fields.author', kind: 'string' },
  { key: 'thumbnail', labelKey: 'admin.fields.thumbnail', kind: 'string' },
  { key: 'created', labelKey: 'admin.fields.created', kind: 'date' },
  { key: 'updated', labelKey: 'admin.fields.updated', kind: 'date' },
  { key: 'lang', labelKey: 'admin.fields.lang', kind: 'enum', options: ['fr', 'en'] },
  { key: 'draft', labelKey: 'admin.fields.draft', kind: 'boolean' },
]

const projectFields: ContentField[] = [
  { key: 'title', labelKey: 'admin.fields.title', kind: 'string', primary: true },
  { key: 'description', labelKey: 'admin.fields.description', kind: 'text', primary: true },
  { key: 'type', labelKey: 'admin.fields.type', kind: 'enum', options: projectTypes, primary: true },
  { key: 'status', labelKey: 'admin.fields.status', kind: 'enum', options: projectStatuses, primary: true },
  { key: 'organization', labelKey: 'admin.fields.organization', kind: 'string', primary: true },
  { key: 'url', labelKey: 'admin.fields.url', kind: 'string', primary: true },
  { key: 'categories', labelKey: 'admin.fields.categories', kind: 'list', primary: true },
  { key: 'technologies', labelKey: 'admin.fields.technologies', kind: 'list', primary: true },
  { key: 'image', labelKey: 'admin.fields.image', kind: 'string' },
  { key: 'startedAt', labelKey: 'admin.fields.startedAt', kind: 'date' },
  { key: 'completedAt', labelKey: 'admin.fields.completedAt', kind: 'date' },
  { key: 'date', labelKey: 'admin.fields.date', kind: 'string' },
  { key: 'duration', labelKey: 'admin.fields.duration', kind: 'string' },
  { key: 'slug', labelKey: 'admin.fields.slug', kind: 'string' },
  { key: 'relatedArticleSlug', labelKey: 'admin.fields.relatedArticle', kind: 'string' },
  { key: 'authors', labelKey: 'admin.fields.authors', kind: 'list' },
  { key: 'draft', labelKey: 'admin.fields.draft', kind: 'boolean' },
]

export const collectionDefinitions: Record<ContentCollection, CollectionDefinition> = {
  pages: { id: 'pages', labelKey: 'admin.collections.pages', fields: pageFields },
  articles: { id: 'articles', labelKey: 'admin.collections.articles', fields: articleFields },
  projects: { id: 'projects', labelKey: 'admin.collections.projects', fields: projectFields },
}

export function isContentCollection(value: string): value is ContentCollection {
  return (contentCollections as readonly string[]).includes(value)
}
