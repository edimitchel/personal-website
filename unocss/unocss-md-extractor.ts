import type { Extractor } from '@unocss/core'

export default function extractorMarkdownIcons(): Extractor {
  return {
    name: 'markdown',
    extract({ code, id, extracted }) {
      const iconRegex = /i-logos(?:-[a-zA-Z0-9-]+)*/g
      const matches = code.match(iconRegex)
      console.log(id, matches)
      if (matches) {
        matches.forEach(match => extracted.add(match))
      }
    },
    order: 1,
  }
}