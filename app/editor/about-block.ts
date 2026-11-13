import { Node, mergeAttributes } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import AboutBlockView from '~/components/admin/AboutBlockView.vue'
import { sliceAboutBlock } from '~~/shared/admin/about-document'

export const AboutBlock = Node.create({
  name: 'aboutBlock',
  group: 'block',
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      raw: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-about-block]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-about-block': '' })]
  },

  addNodeView() {
    return VueNodeViewRenderer(AboutBlockView)
  },

  markdownTokenName: 'aboutBlock',

  markdownTokenizer: {
    name: 'aboutBlock',
    level: 'block' as const,
    start: '::',
    tokenize(src: string) {
      const raw = sliceAboutBlock(src)
      if (!raw) {
        return undefined
      }
      return {
        type: 'aboutBlock',
        raw,
      }
    },
  },

  parseMarkdown(token: { raw?: string }) {
    return {
      type: 'aboutBlock',
      attrs: { raw: token.raw ?? '' },
    }
  },

  renderMarkdown(node: { attrs?: { raw?: string } }) {
    const raw = String(node.attrs?.raw ?? '').replace(/\s+$/, '')
    return raw ? `${raw}\n\n` : ''
  },
})
