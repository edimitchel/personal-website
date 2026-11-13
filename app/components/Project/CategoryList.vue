<template>
  <div class="flex flex-wrap gap-1">
    <span 
      v-for="category in categories" 
      :key="category"
      class="px-2 py-1 text-xs bg-tone-200 dark:bg-tone-700 text-tone-700 dark:text-tone-300 rounded"
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
