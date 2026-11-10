<template>
  <div class="bg-tone-50 dark:bg-tone-800/50 rounded-lg p-4">
    <div class="flex items-center gap-2 mb-3">
      <UIcon :name="icon" class="w-5 h-5 text-tone-600 dark:text-tone-400" />
      <h3 class="font-semibold text-tone-900 dark:text-tone-100 text-sm uppercase tracking-wide">
        {{ title }}
      </h3>
    </div>
    <div class="text-sm">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  icon: string
}

defineProps<Props>()
</script>
