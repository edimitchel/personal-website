<template>
  <UDashboardPanel :ui="{ root: 'min-h-0 flex-1', body: 'gap-0 overflow-y-auto p-0 sm:gap-0 sm:p-0' }">
    <template #header>
      <UDashboardNavbar
        :toggle="false"
        :title="$t('admin.title')"
        :ui="{ root: 'px-6 sm:px-6' }"
      />
    </template>

    <template #body>
      <div class="admin-page">
        <p class="admin-lead">
          {{ $t('admin.intro') }}
        </p>
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          :title="$t('admin.loadError')"
        />
        <nav class="admin-index">
          <NuxtLink
            v-for="collection in data?.collections ?? []"
            :key="collection.id"
            :to="`/admin/${collection.id}`"
            class="admin-index-row"
          >
            <UIcon
              :name="icons[collection.id]"
              class="size-4 shrink-0 text-[var(--admin-muted)]"
            />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium">
                {{ $t(`admin.collections.${collection.id}`) }}
              </span>
              <span class="block truncate text-xs text-[var(--admin-muted)]">
                {{ cardDescription(collection) }}
              </span>
            </span>
            <UIcon
              name="i-lucide-chevron-right"
              class="size-4 shrink-0 text-[var(--admin-muted)]"
            />
          </NuxtLink>
        </nav>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  auth: 'user',
})
defineI18nRoute(false)

const { t } = useI18n()
const { data, error } = await useFetch('/api/admin/collections')

const icons = {
  pages: 'i-lucide-file',
  articles: 'i-lucide-newspaper',
  projects: 'i-lucide-folder-kanban',
} as const

function cardDescription(collection: { count: number, drafts: number }) {
  return `${t('admin.count', { count: collection.count })} · ${t('admin.draftCount', { count: collection.drafts })}`
}

useHead({
  title: 'Admin',
})
</script>
