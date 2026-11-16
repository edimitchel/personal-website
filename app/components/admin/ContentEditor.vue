<template>
  <ClientOnly>
    <UEditor
      v-model="model"
      content-type="markdown"
      :mention="false"
      :extensions="[AboutBlock]"
      :handlers="handlers"
      :placeholder="$t('admin.editorPlaceholder')"
      :ui="{
        root: 'flex w-full min-w-0 flex-col',
        base: 'px-[var(--admin-pad)] pt-4 pb-24 sm:px-[var(--admin-pad)]',
      }"
    >
      <template #default="{ editor }">
        <UEditorToolbar
          :editor="editor"
          :items="toolbar"
          class="admin-editor-toolbar"
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

const toolbar = computed(() => [[
  { kind: 'undo' as const, icon: 'i-lucide-undo', tooltip: { text: t('admin.toolbar.undo') } },
  { kind: 'redo' as const, icon: 'i-lucide-redo', tooltip: { text: t('admin.toolbar.redo') } },
], [
  { kind: 'heading' as const, level: 2 as const, icon: 'i-lucide-heading-2', tooltip: { text: t('admin.toolbar.h2') } },
  { kind: 'heading' as const, level: 3 as const, icon: 'i-lucide-heading-3', tooltip: { text: t('admin.toolbar.h3') } },
  { kind: 'bulletList' as const, icon: 'i-lucide-list', tooltip: { text: t('admin.toolbar.bullet') } },
  { kind: 'orderedList' as const, icon: 'i-lucide-list-ordered', tooltip: { text: t('admin.toolbar.ordered') } },
  { kind: 'blockquote' as const, icon: 'i-lucide-text-quote', tooltip: { text: t('admin.toolbar.quote') } },
  { kind: 'codeBlock' as const, icon: 'i-lucide-square-code', tooltip: { text: t('admin.toolbar.codeBlock') } },
], [
  { kind: 'mark' as const, mark: 'bold' as const, icon: 'i-lucide-bold', tooltip: { text: t('admin.toolbar.bold') } },
  { kind: 'mark' as const, mark: 'italic' as const, icon: 'i-lucide-italic', tooltip: { text: t('admin.toolbar.italic') } },
  { kind: 'mark' as const, mark: 'strike' as const, icon: 'i-lucide-strikethrough', tooltip: { text: t('admin.toolbar.strike') } },
  { kind: 'mark' as const, mark: 'code' as const, icon: 'i-lucide-code', tooltip: { text: t('admin.toolbar.code') } },
]] satisfies EditorToolbarItem<typeof handlers>[][])

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
