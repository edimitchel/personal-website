<template>
  <div
    v-if="data"
    class="border-default mb-4 flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2"
  >
    <UBadge
      v-for="locale in data.locales"
      :key="locale.locale"
      :color="color(locale.state)"
      variant="subtle"
      :label="badge(locale)"
    />
    <UButton
      v-if="translation && translation.state !== 'source'"
      size="sm"
      color="neutral"
      variant="soft"
      icon="i-lucide-languages"
      :label="$t('admin.translateTo', { locale: translation.locale.toUpperCase() })"
      :loading="translating"
      :disabled="!ready"
      @click="translate"
    />
    <UButton
      v-if="counterpart && (counterpart.exists || counterpart.hasDraft)"
      size="sm"
      color="neutral"
      variant="ghost"
      :label="$t('admin.openLocale', { locale: counterpart.locale.toUpperCase() })"
      @click="openLocale(counterpart)"
    />
    <UButton
      v-if="counterpart?.exists"
      size="sm"
      color="neutral"
      variant="ghost"
      :label="comparing ? $t('admin.preview') : $t('admin.compare')"
      @click="toggleCompare"
    />
    <p
      v-if="!ready"
      class="text-muted text-xs"
    >
      {{ $t('admin.translateUnavailable') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ContentLocale, LocaleEntry } from '~~/shared/admin/locales'
import { fileStemFromPath, isFileStem } from '~~/shared/admin/locales'

const props = defineProps<{
  collection: string
  path: string
}>()

const emit = defineEmits<{
  compare: [markdown: string | null]
}>()

const { t } = useI18n()
const comparing = ref(false)
const translating = ref(false)
const ready = computed(() => data.value?.translationReady !== false)
const stem = computed(() => fileStemFromPath(props.collection as 'articles', props.path))

const { data, refresh } = await useFetch('/api/admin/locales', {
  query: computed(() => ({ collection: props.collection, stem: stem.value })),
  immediate: isFileStem(stem.value),
})

const translation = computed(() => data.value?.locales.find(locale => locale.locale !== data.value?.sourceLocale))
const counterpart = computed(() => data.value?.locales.find(locale => locale.path !== props.path))

function color(state: LocaleEntry['state']) {
  if (state === 'current' || state === 'source') return 'success'
  if (state === 'outdated' || state === 'unstamped') return 'warning'
  return 'neutral'
}

function badge(locale: LocaleEntry) {
  const name = locale.locale.toUpperCase()
  return `${name} · ${t(`admin.localeState.${locale.state}`)}`
}

function openLocale(locale: LocaleEntry) {
  return navigateTo({
    path: `/admin/${props.collection}/edit`,
    query: { path: locale.path },
  })
}

async function translate() {
  if (!translation.value || !isFileStem(stem.value)) {
    return
  }
  translating.value = true
  try {
    const saved = await $fetch('/api/admin/translate', {
      method: 'POST',
      body: {
        collection: props.collection,
        stem: stem.value,
        targetLocale: translation.value.locale as ContentLocale,
      },
    })
    await refresh()
    await navigateTo({
      path: `/admin/${props.collection}/edit`,
      query: { path: saved.path },
    })
  }
  catch (error: unknown) {
    const status = typeof error === 'object' && error && 'statusMessage' in error
      ? String(error.statusMessage)
      : ''
    if (status === 'missing-token') {
      await refresh()
    }
  }
  finally {
    translating.value = false
  }
}

async function toggleCompare() {
  if (comparing.value || !counterpart.value) {
    comparing.value = false
    emit('compare', null)
    return
  }
  const document = await $fetch('/api/admin/document', {
    query: { collection: props.collection, path: counterpart.value.path },
  })
  const source = document.draft ?? document.published
  comparing.value = true
  const title = String(source?.frontmatter.title ?? '')
  const body = source?.body ?? ''
  emit('compare', title ? `# ${title}\n\n${body}` : body)
}
</script>
