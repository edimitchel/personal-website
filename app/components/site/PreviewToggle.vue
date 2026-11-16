<template>
  <button
    v-if="admin"
    type="button"
    class="border-tone/40 bg-paper/80 text-ink fixed right-3 bottom-3 z-50 rounded-full border px-2.5 py-1 text-xs opacity-60 backdrop-blur-sm transition hover:opacity-100"
    :class="enabled ? 'opacity-100' : ''"
    @click="toggle"
  >
    {{ enabled ? $t('preview.active') : $t('preview.toggle') }}
  </button>
</template>

<script setup lang="ts">
const { admin, enabled, toggle } = useSitePreview()
</script>
