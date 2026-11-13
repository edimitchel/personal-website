<template>
  <UDashboardPanel>
    <template #header>
      <UDashboardNavbar :title="$t('admin.title')" />
    </template>

    <template #body>
      <UAlert
        color="neutral"
        variant="subtle"
        icon="i-lucide-info"
        :title="$t('admin.intro')"
        class="mb-6"
      />
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        :title="$t('admin.loadError')"
        class="mb-6"
      />
      <UPageGrid>
        <UPageCard
          v-for="collection in data?.collections ?? []"
          :key="collection.id"
          :icon="icons[collection.id]"
          :title="$t(`admin.collections.${collection.id}`)"
          :description="cardDescription(collection)"
          :to="`/admin/${collection.id}`"
        />
      </UPageGrid>
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
