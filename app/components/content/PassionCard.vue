<template>
  <div class="passion-card rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 p-2">
    <div class="mb-4 flex justify-center text-4xl">
      <UIcon
        v-if="icon?.startsWith('i-')"
        :name="icon"
        class="size-10"
      />
      <span v-else>{{ icon }}</span>
    </div>
    <h4 class="text-ink mb-2 text-center text-lg font-semibold">
      {{ title }}
    </h4>
    <div class="text-tone-600 text-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
}>()
</script>

<style scoped>
.passion-card :deep(p) {
  margin: 0;
}
</style>
