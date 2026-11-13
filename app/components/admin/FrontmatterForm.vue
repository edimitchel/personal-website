<template>
  <div class="mb-8 grid gap-4">
    <UTextarea
      v-if="description"
      :model-value="text(description.key)"
      :rows="2"
      :placeholder="$t(description.labelKey)"
      class="w-full text-base"
      @update:model-value="model[description.key] = String($event)"
    />

    <div
      v-for="field in lists"
      :key="field.key"
      class="grid gap-1"
    >
      <p class="text-sm text-[var(--admin-muted)]">
        {{ $t(field.labelKey) }}
      </p>
      <UInputTags
        :model-value="tags(field.key)"
        :placeholder="$t('admin.addItem')"
        class="w-full"
        @update:model-value="model[field.key] = $event"
      />
    </div>

    <div
      v-if="shorts.length || flags.length"
      class="grid gap-3 sm:grid-cols-2"
    >
      <UFormField
        v-for="field in shorts"
        :key="field.key"
        :label="$t(field.labelKey)"
        :class="field.kind === 'text' ? 'sm:col-span-2' : ''"
      >
        <USelect
          v-if="field.kind === 'enum'"
          :model-value="text(field.key) || undefined"
          :items="enumItems(field)"
          :placeholder="$t('admin.unset')"
          class="w-full"
          @update:model-value="model[field.key] = $event == null || $event === '' ? '' : String($event)"
        />
        <UInput
          v-else
          :model-value="field.kind === 'date' ? text(field.key).slice(0, 10) : text(field.key)"
          :type="field.kind === 'date' ? 'date' : 'text'"
          class="w-full"
          @update:model-value="model[field.key] = String($event ?? '')"
        />
      </UFormField>
      <UCheckbox
        v-for="field in flags"
        :key="field.key"
        :model-value="model[field.key] === true"
        :label="$t(field.labelKey)"
        @update:model-value="model[field.key] = $event === true"
      />
    </div>

    <div
      v-if="extraEntries.length"
      class="grid gap-3 sm:grid-cols-2"
    >
      <UFormField
        v-for="entry in extraEntries"
        :key="entry.key"
        :label="entry.key"
      >
        <UInput
          :model-value="entry.value"
          class="w-full"
          @update:model-value="setExtra(entry.key, String($event ?? ''))"
        />
      </UFormField>
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

function text(key: string) {
  const value = model.value[key]
  return value == null ? '' : String(value)
}

function tags(key: string) {
  const value = model.value[key]
  return Array.isArray(value) ? value.map(item => String(item)) : []
}

function enumItems(field: ContentField) {
  const items = [...(field.options ?? [])]
  const current = text(field.key)
  if (current && !items.includes(current)) {
    items.unshift(current)
  }
  return items
}

function setExtra(key: string, value: string) {
  const next = { ...(parsedExtras.value ?? {}), [key]: value }
  extras.value = JSON.stringify(next, null, 2)
}
</script>
