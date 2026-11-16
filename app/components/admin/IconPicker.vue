<template>
  <UPopover v-model:open="open">
    <UButton
      color="neutral"
      variant="outline"
      :aria-label="$t('admin.about.icon')"
      class="size-10 shrink-0 justify-center p-0"
    >
      <UIcon
        v-if="isIcon"
        :name="model"
        class="size-5"
      />
      <span
        v-else-if="model"
        class="text-lg leading-none"
      >{{ model }}</span>
      <UIcon
        v-else
        name="i-lucide-smile-plus"
        class="text-muted size-4"
      />
    </UButton>

    <template #content>
      <div class="w-80 p-3">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          :placeholder="$t('admin.about.iconSearch')"
          autofocus
          class="w-full"
        />
        <div class="mt-2 flex gap-1">
          <UButton
            size="xs"
            color="neutral"
            :variant="tab === 'emoji' ? 'soft' : 'ghost'"
            :label="$t('admin.about.iconEmoji')"
            @click="tab = 'emoji'"
          />
          <UButton
            size="xs"
            color="neutral"
            :variant="tab === 'icon' ? 'soft' : 'ghost'"
            :label="$t('admin.about.iconIcons')"
            @click="tab = 'icon'"
          />
        </div>

        <p
          v-if="tab === 'icon' && loading"
          class="text-muted mt-3 text-xs"
        >
          …
        </p>
        <p
          v-else-if="!visible.length"
          class="text-muted mt-3 text-xs"
        >
          {{ $t('admin.about.iconEmpty') }}
        </p>
        <div
          v-else
          class="mt-3 grid max-h-56 grid-cols-8 gap-1 overflow-auto"
        >
          <button
            v-for="item in visible"
            :key="item"
            type="button"
            class="hover:bg-elevated flex size-8 items-center justify-center rounded-md"
            :class="item === model ? 'bg-elevated ring-accented ring-1' : ''"
            @click="choose(item)"
          >
            <UIcon
              v-if="item.startsWith('i-')"
              :name="item"
              class="size-5"
            />
            <span
              v-else
              class="text-lg leading-none"
            >{{ item }}</span>
          </button>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { TECH_ICON_NAMES } from '~/utils/techIcons'

const model = defineModel<string>({ required: true })
const props = withDefaults(defineProps<{
  prefer?: 'emoji' | 'icon'
}>(), {
  prefer: 'emoji',
})

const open = ref(false)
const query = ref('')
const tab = ref<'emoji' | 'icon'>(props.prefer)
const loading = ref(false)
const remote = ref<string[]>([])

const isIcon = computed(() => model.value.startsWith('i-'))

const emojis = [
  ['🎨', 'art design'],
  ['⚙️', 'backend gear'],
  ['🪢', 'leadership'],
  ['🌟', 'star open'],
  ['💡', 'idea'],
  ['👥', 'people'],
  ['⚡', 'performance'],
  ['📚', 'learn book'],
  ['💻', 'computer web'],
  ['🎯', 'target consulting'],
  ['🚀', 'rocket'],
  ['🔥', 'fire'],
  ['✨', 'spark'],
  ['🎵', 'music'],
  ['📷', 'photo'],
  ['🧠', 'mind'],
  ['🧪', 'test'],
  ['📦', 'package'],
  ['🧩', 'puzzle'],
  ['🌈', 'color'],
  ['📝', 'write'],
  ['🔒', 'lock'],
  ['🌍', 'world'],
  ['💬', 'chat'],
  ['📈', 'chart'],
  ['🧭', 'compass'],
] as const

const favorites = [...new Set(TECH_ICON_NAMES)]

const visible = computed(() => {
  const needle = query.value.trim().toLowerCase()
  if (tab.value === 'emoji') {
    return emojis
      .filter(([, words]) => !needle || words.includes(needle))
      .map(([emoji]) => emoji)
  }
  const source = needle ? remote.value : favorites
  return source.filter(icon => !needle || icon.toLowerCase().includes(needle))
})

const searchIcons = useDebounceFn(async (value: string) => {
  const needle = value.trim()
  if (!needle || tab.value !== 'icon') {
    remote.value = []
    loading.value = false
    return
  }
  loading.value = true
  try {
    const result = await $fetch<{ icons?: string[] }>('https://api.iconify.design/search', {
      query: {
        query: needle,
        prefixes: 'logos,skill-icons,unjs,mdi,lucide',
        limit: 48,
      },
    })
    remote.value = (result.icons ?? []).map(icon => `i-${icon.replace(':', '-')}`)
  }
  catch {
    remote.value = favorites.filter(icon => icon.toLowerCase().includes(needle.toLowerCase()))
  }
  finally {
    loading.value = false
  }
}, 250)

watch(query, (value) => {
  if (tab.value === 'icon') {
    void searchIcons(value)
  }
})

watch(tab, (value) => {
  if (value === 'icon' && query.value.trim()) {
    void searchIcons(query.value)
  }
})

function choose(item: string) {
  model.value = item
  open.value = false
}

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }
  tab.value = model.value.startsWith('i-') ? 'icon' : props.prefer
})
</script>
