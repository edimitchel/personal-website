<template>
  <div class="tech-item bg-paper min-w-0 rounded-lg p-4 text-center shadow-sm shadow-tone/40">
    <div class="mb-2 text-3xl">
      <Icon
        v-if="icon"
        :name="icon"
        mode="css"
        class="tech-logo inline-block"
      />
    </div>
    <div class="text-ink text-sm font-medium break-words">
      {{ name }}
    </div>
    <div class="text-tone-600 text-xs break-words">
      {{ level }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name?: string
  icon?: string
  level?: string
}>()
</script>

<style scoped>
.tech-logo {
  vertical-align: baseline;
}
</style>
