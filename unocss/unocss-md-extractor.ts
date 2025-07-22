import type { Extractor } from '@unocss/core'

/**
 * Extracts icon class names from markdown content.
 * This extractor identifies icon classes following the pattern 'i-logos-*'
 * within the provided code and adds them to the extracted set.
 * It is used to detect and include icon classes for UnoCSS processing.
 */
export default function extractorMarkdownIcons(): Extractor {
  return {
    name: 'markdown',
    extract({ code, id, extracted }) {
      const iconRegex = /i-logos(?:-[a-zA-Z0-9-]+)*/g
      const matches = code.match(iconRegex)
      if (matches) {
        matches.forEach(match => extracted.add(match))
      }
    },
    order: 1,
  }
}