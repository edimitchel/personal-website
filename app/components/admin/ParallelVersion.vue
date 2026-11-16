<template>
  <aside class="admin-col">
    <header class="admin-col-head">
      <p class="min-w-0 truncate">
        {{ otherLabel }}
      </p>
      <UButton
        v-if="otherPath"
        class="ms-auto shrink-0"
        size="xs"
        color="neutral"
        variant="ghost"
        icon="i-lucide-pencil"
        :label="$t('admin.open')"
        @click="openOther"
      />
    </header>

    <div class="admin-col-scroll admin-col-pad">
      <AdminLivePreview
        v-if="otherMarkdown"
        bare
        :source="otherMarkdown"
      />
      <p
        v-else
        class="text-sm text-[var(--admin-muted)]"
      >
        {{ $t('admin.parallel.empty') }}
      </p>

      <div
        v-if="pending.length"
        class="admin-suggestions"
      >
        <article
          v-for="(paragraph, index) in pending"
          :key="paragraph"
          class="admin-suggestion"
        >
          <p class="text-xs text-[var(--admin-muted)]">
            {{ $t('admin.parallel.missing') }}
          </p>
          <p class="text-sm">
            {{ paragraph }}
          </p>
          <p
            v-if="suggestions[index]"
            class="text-sm"
          >
            {{ suggestions[index] }}
          </p>
          <UButton
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
const otherLabel = computed(() => t(`admin.locales.${otherLocale.value}`))

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
