import { collectionDefinitions, type ContentCollection } from './collections'

export function normalizeFrontmatter(value: unknown): unknown {
  if (value instanceof Date) {
    const iso = value.toISOString()
    return iso.endsWith('T00:00:00.000Z') ? iso.slice(0, 10) : iso
  }
  if (Array.isArray(value)) {
    return value.map(item => normalizeFrontmatter(item))
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeFrontmatter(item)]),
    )
  }
  return value
}

export function titleFromFrontmatter(data: Record<string, unknown>, path: string) {
  const title = data.title
  if (typeof title === 'string' && title.trim()) {
    return title.trim()
  }
  const name = data.name
  if (typeof name === 'string' && name.trim()) {
    return name.trim()
  }
  return path.split('/').at(-1) ?? path
}

export function splitFrontmatter(collection: ContentCollection, data: Record<string, unknown>) {
  const fields: Record<string, unknown> = {}
  const extras: Record<string, unknown> = {}
  const known = new Set(collectionDefinitions[collection].fields.map(field => field.key))

  for (const [key, value] of Object.entries(data)) {
    if (known.has(key)) {
      fields[key] = value
    }
    else {
      extras[key] = value
    }
  }

  for (const field of collectionDefinitions[collection].fields) {
    if (!(field.key in fields)) {
      fields[field.key] = field.kind === 'boolean' ? false : ''
    }
    if (field.kind === 'list') {
      const current = fields[field.key]
      fields[field.key] = Array.isArray(current)
        ? current.map(item => String(item)).filter(Boolean)
        : current
          ? String(current).split('\n').map(item => item.trim()).filter(Boolean)
          : []
    }
    if (field.kind === 'string' || field.kind === 'text' || field.kind === 'enum' || field.kind === 'date') {
      const current = fields[field.key]
      fields[field.key] = current === null || current === undefined ? '' : String(current)
    }
  }

  return { fields, extras }
}

export function mergeFrontmatter(
  collection: ContentCollection,
  fields: Record<string, unknown>,
  extras: Record<string, unknown>,
) {
  const known = new Set(collectionDefinitions[collection].fields.map(field => field.key))
  const merged: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(extras)) {
    if (!known.has(key)) {
      merged[key] = value
    }
  }

  for (const field of collectionDefinitions[collection].fields) {
    const value = fields[field.key]

    if (field.kind === 'boolean') {
      if (value === true) {
        merged[field.key] = true
      }
      continue
    }

    if (field.kind === 'list') {
      const list = Array.isArray(value)
        ? value.map(item => String(item).trim()).filter(Boolean)
        : String(value ?? '').split('\n').map(item => item.trim()).filter(Boolean)
      if (list.length) {
        merged[field.key] = list
      }
      continue
    }

    if (field.key === 'duration') {
      const raw = String(value ?? '').trim()
      if (!raw) {
        continue
      }
      const numeric = Number(raw)
      merged[field.key] = Number.isNaN(numeric) ? raw : numeric
      continue
    }

    const raw = typeof value === 'string' ? value.trim() : value
    if (raw !== '' && raw !== null && raw !== undefined) {
      merged[field.key] = raw
    }
  }

  return merged
}
