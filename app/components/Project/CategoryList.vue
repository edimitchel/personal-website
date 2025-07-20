<template>
  <div class="flex flex-wrap gap-1">
    <span 
      v-for="category in categories" 
      :key="category"
      class="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
    >
      {{ category }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  categories: string[]
}

defineProps<Props>()
</script>
