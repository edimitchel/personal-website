import { parseMarkdown } from 'comark'

type Node = string | Block
type Block = [string, Record<string, unknown>, ...Node[]]

function isBlock(value: Node): value is Block {
  return Array.isArray(value) && typeof value[0] === 'string'
}

function textOf(node: Node): string {
  if (typeof node === 'string') {
    return node
  }
  if (!isBlock(node)) {
    return ''
  }
  return node.slice(2).map(child => textOf(child)).join('')
}

function firstHeadingIn(nodes: Node[], tag: string): string {
  for (const node of nodes) {
    if (!isBlock(node)) {
      continue
    }
    if (node[0] === tag) {
      return textOf(node).replace(/\s+/g, ' ').trim()
    }
    const nested = firstHeadingIn(node.slice(2), tag)
    if (nested) {
      return nested
    }
  }
  return ''
}

export async function inspectHeading(body: string) {
  const document = await parseMarkdown(body)
  const nodes = (document.nodes ?? []) as Node[]
  const leading = nodes.find(isBlock)
  const leadingTitle = leading && leading[0] === 'h1'
    ? textOf(leading).replace(/\s+/g, ' ').trim()
    : ''
  const title = leadingTitle || firstHeadingIn(nodes, 'h1')
  const rest = leadingTitle
    ? body.replace(/^#\s+[^\n]*\n?/, '').replace(/^\n/, '')
    : body

  return {
    title: leadingTitle,
    later: leadingTitle ? '' : title,
    rest,
  }
}

export async function ensureHeading(body: string, title: string) {
  const trimmed = title.trim()
  const document = await parseMarkdown(body)
  const nodes = (document.nodes ?? []) as Node[]
  const leading = nodes.find(isBlock)
  if (leading && leading[0] === 'h1') {
    const current = textOf(leading).replace(/\s+/g, ' ').trim()
    if (current === trimmed) {
      return body
    }
    return body.replace(/^#\s+[^\n]*/, `# ${trimmed}`)
  }
  if (firstHeadingIn(nodes, 'h1') === trimmed) {
    return body
  }
  const rest = body.replace(/^\n+/, '')
  return rest ? `# ${trimmed}\n\n${rest}` : `# ${trimmed}\n`
}

export function headingNodes(nodes: Node[]) {
  return firstHeadingIn(nodes, 'h1')
}
