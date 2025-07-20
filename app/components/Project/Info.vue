<template>
  <div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
    <div class="flex items-center gap-2 mb-3">
      <i :class="icon" class="w-5 h-5 text-gray-600 dark:text-gray-400" />
      <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-sm uppercase tracking-wide">
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
