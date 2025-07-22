<template>
  <div class="flex flex-wrap gap-1">
    <span 
      v-for="category in categories" 
      :key="category"
      class="px-2 py-1 text-xs bg-primary-200 dark:bg-primary-700 text-primary-700 dark:text-primary-300 rounded"
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
