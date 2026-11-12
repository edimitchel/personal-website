<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="title">
        <template #right>
          <UButton
            icon="i-lucide-plus"
            :label="$t('admin.newDraft')"
            @click="openCreate"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          :placeholder="$t('admin.search')"
          class="w-full lg:max-w-sm"
        />
        <UTabs
          v-model="state"
          :content="false"
          :items="filters"
          class="w-full lg:w-auto"
        />
      </div>

      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="$t('admin.loadError')"
      />
      <UTable
        v-else
        :data="filtered"
        :columns="columns"
        :loading="status === 'pending'"
        :empty="$t(query || state !== 'all' ? 'admin.emptySearch' : 'admin.empty')"
        @select="onSelect"
      >
        <template #title-cell="{ row }">
          <p class="truncate font-medium">
            {{ row.original.title }}
          </p>
          <p class="text-muted truncate text-xs">
            {{ row.original.path }}
          </p>
        </template>
        <template #state-cell="{ row }">
          <UBadge
            :color="row.original.hasDraft ? 'warning' : 'neutral'"
            variant="subtle"
          >
            {{ row.original.hasDraft ? $t('admin.draft') : $t('admin.statePublished') }}
          </UBadge>
        </template>
      </UTable>

      <UModal
        v-model:open="createOpen"
        :title="$t('admin.newDraft')"
        :description="$t('admin.newDraftHelp')"
      >
        <template #body>
          <UFormField
            :label="$t('admin.path')"
            :description="resolvedPath"
            :error="createError || undefined"
          >
            <UInput
              v-model="stem"
              :placeholder="$t('admin.pathPlaceholder')"
              class="w-full"
              autofocus
              @keydown.enter.prevent="createDraft"
            />
          </UFormField>
        </template>
        <template #footer>
          <UButton
            color="neutral"
            variant="ghost"
            :label="$t('admin.cancel')"
            @click="createOpen = false"
          />
          <UButton
            :label="$t('admin.create')"
            :loading="creating"
            @click="createDraft"
          />
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TableRow } from '@nuxt/ui'
import { isContentCollection } from '~~/shared/admin/collections'
import { parseContentPath } from '~~/shared/admin/paths'

type Entry = {
  path: string
  title: string
  hasDraft: boolean
  hasPublished: boolean
  locales?: { locale: string, state: string }[]
}

definePageMeta({
  layout: 'admin',
})
defineI18nRoute(false)

const route = useRoute()
const { t } = useI18n()
const collection = computed(() => String(route.params.collection))
const query = ref('')
const state = ref('all')
const stem = ref('')
const creating = ref(false)
const createOpen = ref(false)
const createError = ref('')

const { data, error, refresh, status } = await useFetch('/api/admin/entries', {
  query: computed(() => ({ collection: collection.value })),
})

const entries = computed(() => data.value?.entries ?? [])
const title = computed(() => {
  return isContentCollection(collection.value)
    ? t(`admin.collections.${collection.value}`)
    : collection.value
})

const filters = computed(() => [
  { label: t('admin.filters.all'), value: 'all' },
  { label: t('admin.filters.draft'), value: 'draft' },
  { label: t('admin.filters.published'), value: 'published' },
])

const columns = computed(() => [
  { accessorKey: 'title', header: t('admin.fields.title') },
  { accessorKey: 'state', header: t('admin.state') },
])

const filtered = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return entries.value.filter((entry) => {
    if (state.value === 'draft' && !entry.hasDraft) {
      return false
    }
    if (state.value === 'published' && !entry.hasPublished) {
      return false
    }
    if (!needle) {
      return true
    }
    return entry.title.toLowerCase().includes(needle) || entry.path.toLowerCase().includes(needle)
  })
})

const resolvedPath = computed(() => {
  const relative = stem.value.trim().replace(/^\/+/, '')
  if (!relative || !isContentCollection(collection.value)) {
    return ''
  }
  const withExtension = relative.endsWith('.md') ? relative : `${relative}.md`
  return `${collection.value}/${withExtension}`
})

function editLink(path: string) {
  return { path: `/admin/${collection.value}/edit`, query: { path } }
}

function onSelect(_event: Event, row: TableRow<Entry>) {
  navigateTo(editLink(row.original.path))
}

function openCreate() {
  createError.value = ''
  stem.value = ''
  createOpen.value = true
}

async function createDraft() {
  createError.value = ''
  if (!isContentCollection(collection.value) || !parseContentPath(collection.value, resolvedPath.value).ok) {
    createError.value = t('admin.invalidPath')
    return
  }

  creating.value = true
  try {
    await $fetch('/api/admin/drafts', {
      method: 'PUT',
      body: {
        collection: collection.value,
        path: resolvedPath.value,
        frontmatter: {},
        body: '\n',
      },
    })
    await refresh()
    createOpen.value = false
    await navigateTo(editLink(resolvedPath.value))
  }
  catch {
    createError.value = t('admin.saveError')
  }
  finally {
    creating.value = false
  }
}

useHead({
  title: () => `Admin / ${title.value}`,
})
</script>
