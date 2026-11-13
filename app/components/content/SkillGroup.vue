<template>
  <SpotlightCard
    spotlight-color="#f4f4f4"
    class-name="skill-category min-w-0 bg-paper rounded-lg p-6 shadow-sm shadow-tone/40"
  >
    <h4 class="text-ink m-0 mb-4 flex min-w-0 items-center text-xl font-semibold">
      <span class="mr-2 flex size-8 shrink-0 items-center justify-center text-2xl">
        <UIcon
          v-if="icon?.startsWith('i-')"
          :name="icon"
          class="size-7"
        />
        <template v-else>{{ icon }}</template>
      </span>
      <span class="min-w-0">{{ category }}</span>
    </h4>
    <div class="skill-items flex min-w-0 max-w-full flex-wrap gap-2">
      <slot />
    </div>
  </SpotlightCard>
</template>

<script setup lang="ts">
defineProps<{
  category?: string
  icon?: string
}>()
</script>

<style scoped>
.skill-items :deep(ul) {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.skill-items :deep(li) {
  max-width: 100%;
  overflow-wrap: anywhere;
  border-radius: 9999px;
  background: var(--site-tone-200, #e5e7eb);
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
