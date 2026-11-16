import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

const generatedPath = '.output/server/wrangler.json'
const sourcePath = 'wrangler.jsonc'
const bindingKeys = ['r2_buckets', 'kv_namespaces', 'd1_databases']

export function previewWorkerConfig(generated, source) {
  const preview = source?.env?.preview
  const name = preview?.name
  if (typeof name !== 'string' || name === '' || name === 'website' || name === generated?.name) {
    throw new Error('env.preview.name must name a worker other than the production worker')
  }
  const next = { ...generated, name }
  delete next.env
  delete next.route
  delete next.routes
  for (const key of bindingKeys) {
    if (preview[key]) {
      next[key] = preview[key]
    }
  }
  return next
}

const invoked = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href
if (invoked) {
  const generated = JSON.parse(readFileSync(generatedPath, 'utf8'))
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'))
  const next = previewWorkerConfig(generated, source)
  writeFileSync(generatedPath, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`Preview worker: ${next.name}`)
}
