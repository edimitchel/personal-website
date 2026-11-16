<template>
  <div class="admin-field">
    <label
      class="admin-field-label"
      :for="fieldId"
    >{{ $t(field.labelKey) }}</label>
    <div class="admin-field-control">
      <UCheckbox
        v-if="field.kind === 'boolean'"
        :id="fieldId"
        class="admin-field-check"
        :model-value="model[field.key] === true"
        @update:model-value="model[field.key] = $event === true"
      />
      <UInputTags
        v-else-if="field.kind === 'list'"
        :id="fieldId"
        :model-value="tags"
        :placeholder="$t('admin.addItem')"
        size="sm"
        class="w-full"
        @update:model-value="model[field.key] = $event"
      />
      <USelect
        v-else-if="field.kind === 'enum'"
        :id="fieldId"
        :model-value="enumValue"
        :items="enumItems"
        :placeholder="$t('admin.unset')"
        size="sm"
        class="w-full"
        @update:model-value="onEnum"
      />
      <UTextarea
        v-else-if="field.kind === 'text'"
        :id="fieldId"
        :model-value="text"
        :rows="2"
        size="sm"
        class="w-full"
        @update:model-value="model[field.key] = String($event)"
      />
      <UInput
        v-else
        :id="fieldId"
        :model-value="field.kind === 'date' ? text.slice(0, 10) : text"
        :type="field.kind === 'date' ? 'date' : 'text'"
        size="sm"
        class="w-full"
        @update:model-value="model[field.key] = String($event ?? '')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ContentField } from '~~/shared/admin/collections'

const props = defineProps<{
  field: ContentField
}>()

const model = defineModel<Record<string, unknown>>({ required: true })
const fieldId = computed(() => `admin-field-${props.field.key}`)

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
  const items = (props.field.options ?? []).filter(item => item !== '')
  if (text.value && !items.includes(text.value)) {
    return [text.value, ...items]
  }
  return items
})

function onEnum(value: unknown) {
  model.value[props.field.key] = value == null || value === '' ? undefined : String(value)
}
</script>
