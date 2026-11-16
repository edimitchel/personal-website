import { describe, expect, it } from 'vitest'
import { previewWorkerConfig } from '../../scripts/prepare-preview-worker.mjs'

const generated = {
  name: 'website',
  main: 'index.mjs',
  route: { pattern: 'micheledighoffer.fr' },
  r2_buckets: [{ binding: 'BLOB', bucket_name: 'website' }],
  kv_namespaces: [{ binding: 'KV', id: 'prod-kv' }],
  d1_databases: [{ binding: 'DB', database_id: 'prod-db' }],
  env: { preview: { name: 'ignored' } },
}

const source = {
  name: 'website',
  env: {
    preview: {
      name: 'website-preview',
      r2_buckets: [{ binding: 'BLOB', bucket_name: 'website-preview' }],
      kv_namespaces: [{ binding: 'KV', id: 'preview-kv' }],
      d1_databases: [{ binding: 'DB', database_id: 'preview-db' }],
    },
  },
}

describe('preview worker config', () => {
  it('points the generated worker at the preview name and bindings', () => {
    const next = previewWorkerConfig(generated, source)
    expect(next.name).toBe('website-preview')
    expect(next.main).toBe('index.mjs')
    expect(next.env).toBeUndefined()
    expect(next.route).toBeUndefined()
    expect(next.r2_buckets).toEqual(source.env.preview.r2_buckets)
    expect(next.kv_namespaces).toEqual(source.env.preview.kv_namespaces)
    expect(next.d1_databases).toEqual(source.env.preview.d1_databases)
  })

  it('refuses to publish the production worker name', () => {
    expect(() => previewWorkerConfig(generated, { env: { preview: { name: 'website' } } })).toThrow(/production/)
  })
})
