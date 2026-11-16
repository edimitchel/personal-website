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
  return node.slice(2).map(child => textOf(child)).join('')
}

export type ProseBlock = {
  kind: 'heading' | 'paragraph'
  text: string
}

export async function proseBlocks(markdown: string): Promise<ProseBlock[]> {
  const document = await parseMarkdown(markdown)
  const blocks: ProseBlock[] = []
  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (!isBlock(node)) {
        continue
      }
      if (/^h[1-6]$/.test(node[0])) {
        const text = textOf(node).replace(/\s+/g, ' ').trim()
        if (text) {
          blocks.push({ kind: 'heading', text })
        }
        continue
      }
      if (node[0] === 'p') {
        const text = textOf(node).replace(/\s+/g, ' ').trim()
        if (text) {
          blocks.push({ kind: 'paragraph', text })
        }
        continue
      }
      walk(node.slice(2))
    }
  }
  walk((document.nodes ?? []) as Node[])
  return blocks
}

export function untranslatedParagraphs(current: ProseBlock[], other: ProseBlock[]) {
  const currentSections = sections(current)
  const otherSections = sections(other)
  const extra: string[] = []
  currentSections.forEach((paragraphs, index) => {
    const known = otherSections[index]?.length ?? 0
    extra.push(...paragraphs.slice(known))
  })
  return extra
}

function sections(blocks: ProseBlock[]) {
  const groups: string[][] = [[]]
  for (const block of blocks) {
    if (block.kind === 'heading') {
      groups.push([])
      continue
    }
    groups[groups.length - 1]?.push(block.text)
  }
  return groups.filter(group => group.length)
}
