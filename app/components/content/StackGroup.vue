<template>
  <div class="min-w-0">
    <h3 class="text-ink m-0 mb-4 text-xl font-semibold">
      {{ category }}
    </h3>
    <div class="grid min-w-0 grid-cols-2 gap-4 sm:grid-cols-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  category?: string
}>()
</script>
