<template>
  <UCheckbox
    v-if="field.kind === 'boolean'"
    :model-value="model[field.key] === true"
    :label="$t(field.labelKey)"
    @update:model-value="model[field.key] = $event === true"
  />
  <UFormField
    v-else
    :label="$t(field.labelKey)"
  >
    <UInputTags
      v-if="field.kind === 'list'"
      :model-value="tags"
      :placeholder="$t('admin.addItem')"
      class="w-full"
      @update:model-value="model[field.key] = $event"
    />
    <USelect
      v-else-if="field.kind === 'enum'"
      :model-value="enumValue"
      :items="enumItems"
      :placeholder="$t('admin.unset')"
      class="w-full"
      @update:model-value="model[field.key] = $event == null || $event === '' ? '' : String($event)"
    />
    <UTextarea
      v-else-if="field.kind === 'text'"
      :model-value="text"
      :rows="2"
      class="w-full"
      @update:model-value="model[field.key] = String($event)"
    />
    <UInput
      v-else
      :model-value="field.kind === 'date' ? text.slice(0, 10) : text"
      :type="field.kind === 'date' ? 'date' : 'text'"
      class="w-full"
      @update:model-value="model[field.key] = String($event ?? '')"
    />
  </UFormField>
</template>

<script setup lang="ts">
import type { ContentField } from '~~/shared/admin/collections'

const props = defineProps<{
  field: ContentField
}>()

const model = defineModel<Record<string, unknown>>({ required: true })

const text = computed(() => {
  const value = model.value[props.field.key]
  return value === null || value === undefined ? '' : String(value)
})

const tags = computed(() => {
  const value = model.value[props.field.key]
  return Array.isArray(value) ? value.map(item => String(item)) : []
})

const enumValue = computed(() => text.value || undefined)

const enumItems = computed(() => {
  const items = [...(props.field.options ?? [])]
  if (text.value && !items.includes(text.value)) {
    items.unshift(text.value)
  }
  return items
})
</script>
