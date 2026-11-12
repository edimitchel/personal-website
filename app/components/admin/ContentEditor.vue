<template>
  <ClientOnly>
    <UEditor
      v-model="model"
      content-type="markdown"
      :mention="false"
      :extensions="[AboutBlock]"
      :handlers="handlers"
      :placeholder="$t('admin.editorPlaceholder')"
      :ui="{ base: 'px-4 py-3 sm:px-6' }"
      class="border-default min-h-[32rem] rounded-lg border bg-transparent"
    >
      <template #default="{ editor }">
        <UEditorToolbar
          :editor="editor"
          :items="toolbar"
          class="border-default bg-default sticky top-0 z-10 overflow-x-auto border-b px-2 py-1"
        />
        <UEditorToolbar
          :editor="editor"
          :items="bubble"
          layout="bubble"
        />
        <UEditorSuggestionMenu
          :editor="editor"
          :items="suggestions"
        />
        <UEditorDragHandle
          :editor="editor"
          icon="i-lucide-grip-vertical"
        />
      </template>
    </UEditor>
    <template #fallback>
      <USkeleton class="h-96 w-full" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { EditorCustomHandlers, EditorSuggestionMenuItem, EditorToolbarItem } from '@nuxt/ui'
import type { Editor } from '@tiptap/vue-3'
import { AboutBlock } from '~/editor/about-block'
import { writeAboutBlock, type AboutContent } from '~~/shared/admin/about-document'

const model = defineModel<string>({ required: true })
const { t } = useI18n()

const emptyAbout: AboutContent = {
  name: '',
  title: '',
  description: '',
  skills: [],
  stack: [],
  passions: [],
  mission: '',
  vision: '',
  services: [],
}

const handlers = {
  aboutBlock: {
    canExecute: () => true,
    execute: (editor: Editor) => {
      return editor.chain().focus().insertContent({
        type: 'aboutBlock',
        attrs: { raw: writeAboutBlock(emptyAbout) },
      }).run()
    },
    isActive: (editor: Editor) => editor.isActive('aboutBlock'),
  },
} satisfies EditorCustomHandlers

const toolbar = [[
  { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: 'Undo' } },
  { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: 'Redo' } },
], [
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', tooltip: { text: 'H2' } },
  { kind: 'heading', level: 3, icon: 'i-lucide-heading-3', tooltip: { text: 'H3' } },
  { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Liste' } },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Liste numérotée' } },
  { kind: 'blockquote', icon: 'i-lucide-text-quote', tooltip: { text: 'Citation' } },
  { kind: 'codeBlock', icon: 'i-lucide-square-code', tooltip: { text: 'Code' } },
], [
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Gras' } },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Italique' } },
  { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough', tooltip: { text: 'Barré' } },
  { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Code' } },
]] satisfies EditorToolbarItem<typeof handlers>[][]

const bubble = [[
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough' },
  { kind: 'mark', mark: 'code', icon: 'i-lucide-code' },
]] satisfies EditorToolbarItem<typeof handlers>[][]

const suggestions = computed(() => [[
  { type: 'label' as const, label: t('admin.blocks') },
  { kind: 'paragraph' as const, label: t('admin.blocksParagraph'), icon: 'i-lucide-type' },
  { kind: 'heading' as const, level: 2 as const, label: t('admin.blocksHeading'), icon: 'i-lucide-heading-2' },
  { kind: 'bulletList' as const, label: t('admin.blocksList'), icon: 'i-lucide-list' },
  { kind: 'orderedList' as const, label: t('admin.blocksOrdered'), icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote' as const, label: t('admin.blocksQuote'), icon: 'i-lucide-text-quote' },
  { kind: 'codeBlock' as const, label: t('admin.blocksCode'), icon: 'i-lucide-square-code' },
  { kind: 'horizontalRule' as const, label: t('admin.blocksRule'), icon: 'i-lucide-minus' },
  { kind: 'aboutBlock' as const, label: t('admin.about.block'), icon: 'i-lucide-user' },
]] satisfies EditorSuggestionMenuItem<typeof handlers>[][])
</script>
