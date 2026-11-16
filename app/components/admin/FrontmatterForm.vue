<template>
  <div class="admin-fiche">
    <AdminFrontmatterField
      v-if="description"
      v-model="model"
      :field="description"
    />
    <AdminFrontmatterField
      v-for="field in lists"
      :key="field.key"
      v-model="model"
      :field="field"
    />
    <AdminFrontmatterField
      v-for="field in shorts"
      :key="field.key"
      v-model="model"
      :field="field"
    />
    <AdminFrontmatterField
      v-for="field in flags"
      :key="field.key"
      v-model="model"
      :field="field"
    />
    <div
      v-for="entry in extraEntries"
      :key="entry.key"
      class="admin-field"
    >
      <label
        class="admin-field-label"
        :for="`admin-extra-${entry.key}`"
      >{{ entry.key }}</label>
      <div class="admin-field-control">
        <UInput
          :id="`admin-extra-${entry.key}`"
          :model-value="entry.value"
          size="sm"
          class="w-full"
          @update:model-value="setExtra(entry.key, String($event ?? ''))"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentField } from '~~/shared/admin/collections'

const props = defineProps<{
  fields: ContentField[]
}>()

const model = defineModel<Record<string, unknown>>({ required: true })
const extras = defineModel<string>('extras', { required: true })

const hiddenKeys = new Set(['title', 'lang', 'draft'])
const hiddenExtras = new Set(['original_slug', 'source_content_hash', '_i18nSourceHash', 'translate_state'])
const visible = computed(() => props.fields.filter(field => !hiddenKeys.has(field.key)))
const description = computed(() => visible.value.find(field => field.key === 'description'))
const lists = computed(() => visible.value.filter(field => field.kind === 'list'))
const flags = computed(() => visible.value.filter(field => field.kind === 'boolean'))
const shorts = computed(() => visible.value.filter(field => field.kind !== 'list' && field.kind !== 'boolean' && field.key !== 'description'))

const parsedExtras = computed(() => {
  try {
    const parsed = JSON.parse(extras.value || '{}') as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null
    }
    return parsed as Record<string, unknown>
  }
  catch {
    return null
  }
})

const extraEntries = computed(() => {
  if (!parsedExtras.value) {
    return []
  }
  return Object.entries(parsedExtras.value)
    .filter(([key, value]) => !hiddenExtras.has(key) && (value == null || ['string', 'number', 'boolean'].includes(typeof value)))
    .map(([key, value]) => ({ key, value: value == null ? '' : String(value) }))
})

function setExtra(key: string, value: string) {
  const next = { ...(parsedExtras.value ?? {}), [key]: value }
  extras.value = JSON.stringify(next, null, 2)
}
</script>
