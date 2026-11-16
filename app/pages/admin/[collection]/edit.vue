<template>
  <UDashboardPanel :ui="{ root: 'min-h-0 flex-1', body: 'min-h-0 gap-0 overflow-y-auto p-0 sm:gap-0 sm:p-0 xl:overflow-hidden' }">
    <template #header>
      <UDashboardNavbar
        :toggle="false"
        :ui="{ root: 'px-6 sm:px-6', right: 'gap-2' }"
      >
        <template #title>
          <UBreadcrumb
            :items="crumbs"
            :ui="{ separatorIcon: 'size-3.5', list: 'gap-1' }"
          />
        </template>
        <template #right>
          <div class="admin-segment">
            <UTooltip
              v-for="item in viewModes"
              :key="item.id"
              :text="item.label"
            >
              <UButton
                color="neutral"
                size="sm"
                :variant="viewMode === item.id ? 'soft' : 'ghost'"
                :icon="item.icon"
                :aria-label="item.label"
                :aria-pressed="viewMode === item.id"
                @click="viewMode = item.id"
              >
                <span class="hidden sm:inline">{{ item.label }}</span>
              </UButton>
            </UTooltip>
          </div>
          <UBadge
            v-if="dirty"
            class="hidden md:inline-flex"
            color="warning"
            variant="subtle"
            size="sm"
            :label="$t('admin.unsaved')"
          />
          <UTooltip
            v-if="data?.draft"
            :text="$t('admin.discard')"
          >
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-trash-2"
              :aria-label="$t('admin.discard')"
              :loading="pendingAction === 'discard'"
              @click="discardOpen = true"
            />
          </UTooltip>
          <span
            class="admin-sep"
            aria-hidden="true"
          />
          <div class="flex items-center gap-0.5">
            <UTooltip :text="publishHint">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                icon="i-lucide-upload"
                :aria-label="$t('admin.publish')"
                :disabled="!data?.draft || pendingAction !== ''"
                :loading="pendingAction === 'publish'"
                @click="publish"
              />
            </UTooltip>
            <UTooltip :text="canSave ? $t('admin.save') : $t('admin.missingTitle')">
              <UButton
                size="sm"
                icon="i-lucide-save"
                :aria-label="$t('admin.save')"
                :disabled="!canSave || pendingAction !== ''"
                :loading="pendingAction === 'save'"
                @click="save"
              />
            </UTooltip>
          </div>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div
        v-if="!path || error"
        class="admin-page"
      >
        <UAlert
          color="error"
          variant="subtle"
          icon="i-lucide-file-warning"
          :title="$t('admin.notFound')"
        />
      </div>

      <div
        v-else-if="status === 'pending' && !data"
        class="admin-page"
      >
        <USkeleton class="h-8 w-48" />
        <USkeleton class="h-64" />
      </div>

      <div
        v-else
        class="admin-split"
        :class="{ 'is-split': viewMode === 'edit' }"
      >
        <section
          v-show="viewMode === 'edit'"
          class="admin-col"
        >
          <header class="admin-col-head">
            <span class="truncate">{{ localeLabel }}</span>
          </header>
          <div class="admin-col-scroll">
            <div class="admin-doc">
              <template v-if="!hasAbout">
                <input
                  v-model="documentTitle"
                  class="admin-doc-title"
                  autocomplete="off"
                  :placeholder="$t('admin.documentTitle')"
                  :aria-label="$t('admin.documentTitle')"
                  :aria-invalid="!documentTitle.trim()"
                >
                <p
                  v-if="!documentTitle.trim()"
                  class="text-error text-[0.8125rem] leading-5"
                >
                  {{ $t('admin.missingTitle') }}
                </p>
                <UButton
                  v-if="!documentTitle.trim() && laterHeading"
                  class="self-start"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :label="$t('admin.useHeading', { title: laterHeading })"
                  @click="documentTitle = laterHeading"
                />
                <UButton
                  v-else-if="!documentTitle.trim() && recordedTitle"
                  class="self-start"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :label="$t('admin.useRecorded', { title: recordedTitle })"
                  @click="documentTitle = recordedTitle"
                />
              </template>
              <AdminFrontmatterForm
                v-if="data"
                v-model="form"
                v-model:extras="extrasText"
                :fields="ficheFields"
              />
              <p
                v-if="hasAbout && !documentTitle.trim()"
                class="text-error text-[0.8125rem] leading-5"
              >
                {{ $t('admin.missingTitle') }}
              </p>
            </div>
            <AdminContentEditor v-model="body" />
          </div>
        </section>

        <AdminParallelVersion
          v-if="viewMode === 'edit' && path"
          :collection="collection"
          :path="path"
          :source="previewSource"
        />

        <AdminLivePreview
          v-show="viewMode === 'preview'"
          :source="previewSource"
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
const currentLocale = computed(() => path.value.includes('/fr/') ? 'fr' : 'en')
const localeLabel = computed(() => t(`admin.locales.${currentLocale.value}`))
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
