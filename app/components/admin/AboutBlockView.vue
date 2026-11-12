<template>
  <NodeViewWrapper class="my-4">
    <div
      class="border-default rounded-lg border bg-transparent p-4"
      data-drag-handle
    >
      <p class="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
        {{ $t('admin.about.block') }}
      </p>
      <AdminAboutEditor
        v-if="content"
        v-model="content"
      />
    </div>
  </NodeViewWrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import type { AboutContent } from '~~/shared/admin/about-document'
import { readAbout, writeAboutBlock } from '~~/shared/admin/about-document'

const props = defineProps(nodeViewProps)
const content = ref<AboutContent | null>(null)
let skipWrite = true

watch(() => props.node.attrs.raw, async (raw: string) => {
  if (!raw) {
    return
  }
  skipWrite = true
  content.value = await readAbout(raw, {})
  await nextTick()
  skipWrite = false
}, { immediate: true })

watch(content, (value) => {
  if (!value || skipWrite) {
    return
  }
  const raw = writeAboutBlock(value)
  if (raw === props.node.attrs.raw) {
    return
  }
  props.updateAttributes({ raw })
}, { deep: true })
</script>
