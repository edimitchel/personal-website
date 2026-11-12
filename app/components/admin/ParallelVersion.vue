<template>
  <aside class="border-default min-h-[32rem] rounded-lg border bg-transparent">
    <header class="border-default flex items-center justify-between gap-2 border-b px-3 py-2">
      <p class="text-muted text-sm">
        {{ otherLabel }}
      </p>
      <UButton
        v-if="otherPath"
        size="xs"
        color="neutral"
        variant="ghost"
        :label="otherLabel"
        @click="openOther"
      />
    </header>

    <div class="px-4 py-4">
      <AdminLivePreview
        v-if="otherMarkdown"
        bare
        :source="otherMarkdown"
      />
      <p
        v-else
        class="text-muted text-sm"
      >
        {{ $t('admin.parallel.empty') }}
      </p>

      <div
        v-if="pending.length"
        class="mt-6 grid gap-3"
      >
        <article
          v-for="(paragraph, index) in pending"
          :key="paragraph"
          class="border-default/70 rounded-md border border-dashed px-3 py-2"
        >
          <p class="text-muted text-xs">
            {{ $t('admin.parallel.missing') }}
          </p>
          <p class="mt-1 text-sm">
            {{ paragraph }}
          </p>
          <p
            v-if="suggestions[index]"
            class="mt-2 text-sm"
          >
            {{ suggestions[index] }}
          </p>
          <UButton
            class="mt-2"
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-languages"
            :label="suggestions[index] ? $t('admin.parallel.keep') : $t('admin.parallel.suggest')"
            :loading="loadingIndex === index"
            @click="suggestions[index] ? keep(index) : suggest(index)"
          />
        </article>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ContentLocale } from '~~/shared/admin/locales'
import { fileStemFromPath, isFileStem, pathForLocale } from '~~/shared/admin/locales'
import { proseBlocks, untranslatedParagraphs } from '~~/shared/admin/paragraphs'

const props = defineProps<{
  collection: string
  path: string
  source: string
}>()

const { t } = useI18n()
const suggestions = ref<Record<number, string>>({})
const loadingIndex = ref(-1)
const pending = ref<string[]>([])

const stem = computed(() => fileStemFromPath(props.collection as 'articles', props.path))
const currentLocale = computed<ContentLocale>(() => props.path.includes('/fr/') ? 'fr' : 'en')
const otherLocale = computed<ContentLocale>(() => currentLocale.value === 'fr' ? 'en' : 'fr')
const otherPath = computed(() => {
  return isFileStem(stem.value)
    ? pathForLocale(props.collection as 'articles', stem.value, otherLocale.value)
    : ''
})
const otherLabel = computed(() => otherLocale.value === 'fr' ? 'Français' : 'English')

const { data: otherDocument, refresh } = await useAsyncData(
  () => `parallel-${props.collection}-${otherPath.value}`,
  async () => {
    if (!otherPath.value) {
      return null
    }
    try {
      return await $fetch('/api/admin/document', {
        query: { collection: props.collection, path: otherPath.value },
      })
    }
    catch {
      return null
    }
  },
  { watch: [otherPath] },
)

const otherMarkdown = computed(() => {
  const source = otherDocument.value?.draft ?? otherDocument.value?.published
  if (!source) {
    return ''
  }
  const title = String(source.frontmatter?.title ?? '').trim()
  if (title && !source.body.trimStart().startsWith('# ')) {
    return `# ${title}\n\n${source.body}`
  }
  return source.body
})

watch([() => props.source, otherMarkdown], async () => {
  if (!otherMarkdown.value) {
    pending.value = []
    return
  }
  const [current, other] = await Promise.all([
    proseBlocks(props.source),
    proseBlocks(otherMarkdown.value),
  ])
  pending.value = untranslatedParagraphs(current, other)
}, { immediate: true })

async function suggest(index: number) {
  const text = pending.value[index]
  if (!text) {
    return
  }
  loadingIndex.value = index
  try {
    const result = await $fetch('/api/admin/translate-fragment', {
      method: 'POST',
      body: {
        text,
        sourceLocale: currentLocale.value,
        targetLocale: otherLocale.value,
      },
    })
    suggestions.value = { ...suggestions.value, [index]: result.suggestion }
  }
  catch {
    suggestions.value = { ...suggestions.value, [index]: t('admin.translateUnavailable') }
  }
  finally {
    loadingIndex.value = -1
  }
}

async function keep(index: number) {
  const suggestion = suggestions.value[index]
  if (!suggestion || !otherPath.value) {
    return
  }
  const source = otherDocument.value?.draft ?? otherDocument.value?.published
  const body = `${source?.body ?? ''}\n\n${suggestion}\n`
  await $fetch('/api/admin/drafts', {
    method: 'PUT',
    body: {
      collection: props.collection,
      path: otherPath.value,
      frontmatter: source?.frontmatter ?? {},
      body,
    },
  })
  suggestions.value = {}
  await refresh()
}

function openOther() {
  return navigateTo({
    path: `/admin/${props.collection}/edit`,
    query: { path: otherPath.value },
  })
}
</script>
