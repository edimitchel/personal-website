<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar>
        <template #title>
          <UBreadcrumb :items="crumbs" />
        </template>
        <template #right>
          <div class="flex items-center gap-1">
            <UButton
              v-for="item in viewModes"
              :key="item.id"
              color="neutral"
              :variant="viewMode === item.id ? 'soft' : 'ghost'"
              :icon="item.icon"
              :label="item.label"
              size="sm"
              @click="viewMode = item.id"
            />
          </div>
          <UBadge
            v-if="dirty"
            color="warning"
            variant="subtle"
            :label="$t('admin.unsaved')"
          />
          <UTooltip
            v-if="data?.draft"
            :text="$t('admin.discard')"
          >
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-trash-2"
              :aria-label="$t('admin.discard')"
              :loading="pendingAction === 'discard'"
              @click="discardOpen = true"
            />
          </UTooltip>
          <UTooltip :text="publishHint">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-upload"
              :aria-label="$t('admin.publish')"
              :disabled="!data?.draft || pendingAction !== ''"
              :loading="pendingAction === 'publish'"
              @click="publish"
            />
          </UTooltip>
          <UTooltip :text="canSave ? $t('admin.save') : $t('admin.missingTitle')">
            <UButton
              icon="i-lucide-save"
              :aria-label="$t('admin.save')"
              :disabled="!canSave || pendingAction !== ''"
              :loading="pendingAction === 'save'"
              @click="save"
            />
          </UTooltip>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <UAlert
        v-if="!path || error"
        color="error"
        variant="subtle"
        icon="i-lucide-file-warning"
        :title="$t('admin.notFound')"
      />

      <div
        v-else-if="status === 'pending' && !data"
        class="grid gap-3"
      >
        <USkeleton class="h-8 w-48" />
        <USkeleton class="h-64" />
      </div>

      <div
        v-else
        class="grid items-start gap-6"
        :class="viewMode === 'edit' ? 'xl:grid-cols-2' : ''"
      >
        <div
          v-show="viewMode === 'edit'"
          class="min-w-0"
        >
          <label
            v-if="!hasAbout"
            class="mb-6 block"
          >
            <input
              v-model="documentTitle"
              :placeholder="$t('admin.documentTitle')"
              class="w-full border-0 border-b bg-transparent pb-2 text-3xl font-semibold text-current outline-none placeholder:text-[var(--admin-muted)]"
              :class="documentTitle.trim() ? 'border-transparent' : 'border-error'"
            >
            <p
              v-if="documentTitle.trim()"
              class="text-muted mt-2 text-sm"
            >
              {{ $t('admin.storedTitle', { title: documentTitle.trim() }) }}
            </p>
            <p
              v-else
              class="text-error mt-2 text-sm"
            >
              {{ $t('admin.missingTitle') }}
            </p>
            <UButton
              v-if="!documentTitle.trim() && laterHeading"
              class="mt-2"
              color="neutral"
              variant="ghost"
              size="sm"
              :label="$t('admin.useHeading', { title: laterHeading })"
              @click="documentTitle = laterHeading"
            />
            <UButton
              v-else-if="!documentTitle.trim() && recordedTitle"
              class="mt-2"
              color="neutral"
              variant="ghost"
              size="sm"
              :label="$t('admin.useRecorded', { title: recordedTitle })"
              @click="documentTitle = recordedTitle"
            />
          </label>
          <AdminFrontmatterForm
            v-if="data"
            v-model="form"
            v-model:extras="extrasText"
            :fields="ficheFields"
          />
          <p
            v-if="hasAbout && !documentTitle.trim()"
            class="text-error mb-3 text-sm"
          >
            {{ $t('admin.missingTitle') }}
          </p>
          <AdminContentEditor v-model="body" />
        </div>

        <AdminParallelVersion
          v-if="viewMode === 'edit' && path"
          :collection="collection"
          :path="path"
          :source="previewSource"
        />

        <AdminLivePreview
          v-show="viewMode === 'preview'"
          :source="previewSource"
          class="xl:sticky xl:top-0 xl:max-h-[calc(100dvh-11rem)]"
        />
      </div>

      <UModal
        v-model:open="discardOpen"
        :title="$t('admin.discardTitle')"
        :description="$t('admin.discardDescription')"
      >
        <template #footer>
          <UButton
            color="neutral"
            variant="ghost"
            :label="$t('admin.cancel')"
            @click="discardOpen = false"
          />
          <UButton
            color="error"
            icon="i-lucide-trash-2"
            :label="$t('admin.discardConfirm')"
            :loading="pendingAction === 'discard'"
            @click="discard"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { isContentCollection } from '~~/shared/admin/collections'
import { mergeFrontmatter, splitFrontmatter } from '~~/shared/admin/document'
import { ensureHeading, inspectHeading } from '~~/shared/admin/heading'

definePageMeta({
  layout: 'admin',
  auth: 'user',
})
defineI18nRoute(false)

const route = useRoute()
const { t } = useI18n()
const toast = useToast()
const collection = computed(() => String(route.params.collection))
const path = computed(() => String(route.query.path ?? ''))

const form = ref<Record<string, unknown>>({})
const extrasText = ref('{}')
const body = ref('')
const documentTitle = ref('')
const laterHeading = ref('')
const recordedTitle = ref('')
const snapshot = ref('')
const pendingAction = ref('')
const discardOpen = ref(false)

const viewMode = ref<'edit' | 'preview'>('edit')
const viewModes = computed(() => [
  { id: 'edit' as const, icon: 'i-lucide-pencil', label: t('admin.viewEdit') },
  { id: 'preview' as const, icon: 'i-lucide-eye', label: t('admin.preview') },
])
const hasAbout = computed(() => /::about\b/i.test(body.value))
const previewSource = computed(() => {
  if (hasAbout.value || !documentTitle.value.trim()) {
    return body.value
  }
  return `# ${documentTitle.value.trim()}\n\n${body.value}`
})
const ficheFields = computed(() => {
  const hidden = new Set(hasAbout.value ? ['title', 'description'] : ['title'])
  return (data.value?.fields ?? []).filter(field => !hidden.has(field.key))
})
const canSave = computed(() => Boolean(documentTitle.value.trim()))

const { data, error, refresh, status } = await useFetch('/api/admin/document', {
  query: computed(() => ({
    collection: collection.value,
    path: path.value,
  })),
  immediate: path.value.length > 0,
  watch: [path, collection],
})

const heading = computed(() => {
  const title = form.value.title
  if (typeof title === 'string' && title.trim()) {
    return title.trim()
  }
  return path.value.split('/').at(-1) || t('admin.open')
})

const crumbs = computed(() => [
  { label: t('admin.title'), to: '/admin' },
  {
    label: isContentCollection(collection.value) ? t(`admin.collections.${collection.value}`) : collection.value,
    to: `/admin/${collection.value}`,
  },
  { label: heading.value },
])

const publishHint = computed(() => {
  const publishState = data.value?.publish
  if (!publishState) {
    return ''
  }
  if (!data.value?.draft) {
    return t('admin.reasons.no-draft')
  }
  return t('admin.publishLive')
})

const dirty = computed(() => snapshot.value !== currentSnapshot())

function currentSnapshot() {
  return JSON.stringify({
    form: form.value,
    extras: extrasText.value,
    body: body.value,
    title: documentTitle.value,
  })
}

watch(data, async (document) => {
  if (!document || !isContentCollection(document.collection)) {
    return
  }
  const source = document.draft ?? document.published
  const split = splitFrontmatter(document.collection, source?.frontmatter ?? {})
  form.value = split.fields
  extrasText.value = JSON.stringify(split.extras, null, 2)
  const sourceBody = source?.body ?? ''
  recordedTitle.value = String(split.fields.title ?? '')
  const heading = await inspectHeading(sourceBody)
  const aboutDocument = /::about\b/i.test(sourceBody)
  documentTitle.value = heading.title || (aboutDocument ? heading.later : '')
  laterHeading.value = aboutDocument ? '' : heading.later
  body.value = aboutDocument ? sourceBody : heading.rest
  // The editor normalizes the About block once while it mounts.
  setTimeout(() => {
    snapshot.value = currentSnapshot()
  }, 500)
}, { immediate: true })

watch(body, async (value) => {
  if (!/::about\b/i.test(value)) {
    return
  }
  const heading = await inspectHeading(value)
  const next = heading.title || heading.later
  if (next && next !== documentTitle.value) {
    documentTitle.value = next
  }
})

function readExtras() {
  const parsed = JSON.parse(extrasText.value || '{}') as unknown
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('json')
  }
  return parsed as Record<string, unknown>
}

async function save() {
  if (!isContentCollection(collection.value) || pendingAction.value || !canSave.value) {
    return
  }
  let extras: Record<string, unknown>
  try {
    extras = readExtras()
  }
  catch {
    toast.add({ title: t('admin.extrasInvalid'), color: 'error' })
    return
  }

  const title = documentTitle.value.trim()
  const draftBody = await ensureHeading(body.value, title)
  pendingAction.value = 'save'
  try {
    await $fetch('/api/admin/drafts', {
      method: 'PUT',
      body: {
        collection: collection.value,
        path: path.value,
        frontmatter: {
          ...mergeFrontmatter(collection.value, form.value, extras),
          title,
        },
        body: draftBody,
      },
    })
    await refresh()
    toast.add({ title: t('admin.saved'), color: 'success' })
  }
  catch {
    toast.add({ title: t('admin.saveError'), color: 'error' })
  }
  finally {
    pendingAction.value = ''
  }
}

async function discard() {
  const hadPublished = Boolean(data.value?.published)
  pendingAction.value = 'discard'
  try {
    await $fetch('/api/admin/drafts', {
      method: 'DELETE',
      query: {
        collection: collection.value,
        path: path.value,
      },
    })
    discardOpen.value = false
    toast.add({ title: t('admin.discarded'), color: 'success' })
    if (!hadPublished) {
      await navigateTo(`/admin/${collection.value}`)
      return
    }
    await refresh()
  }
  catch {
    toast.add({ title: t('admin.saveError'), color: 'error' })
  }
  finally {
    pendingAction.value = ''
  }
}

async function publish() {
  if (!data.value?.draft || pendingAction.value) {
    return
  }
  pendingAction.value = 'publish'
  try {
    await $fetch('/api/admin/publish', {
      method: 'POST',
      body: {
        collection: collection.value,
        path: path.value,
      },
    })
    toast.add({
      title: t('admin.publishedOk'),
      color: 'success',
    })
    await refresh()
  }
  catch (cause: unknown) {
    const statusMessage = typeof cause === 'object' && cause && 'statusMessage' in cause
      ? String(cause.statusMessage)
      : 'github-write-failed'
    toast.add({
      title: t('admin.publishBlocked', { reason: t(`admin.reasons.${statusMessage}`) }),
      color: 'error',
    })
  }
  finally {
    pendingAction.value = ''
  }
}

defineShortcuts({
  meta_s: {
    usingInput: true,
    handler: () => {
      void save()
    },
  },
})

useHead({
  title: () => `Admin / ${heading.value}`,
})
</script>
