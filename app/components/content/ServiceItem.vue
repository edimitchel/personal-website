<template>
  <div class="bg-tone/20 flex rounded-lg">
    <div class="flex w-10 shrink-0 grow-0 items-center justify-center text-2xl">
      <UIcon
        v-if="icon?.startsWith('i-')"
        :name="icon"
        class="size-6"
      />
      <template v-else>
        {{ icon }}
      </template>
    </div>
    <div>
      <h5 class="font-semibold">
        {{ name }}
      </h5>
      <div class="text-tone-600 m-0 text-sm text-balance sm:pr-20">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  name?: string
  icon?: string
}>()
</script>

<style scoped>
div :deep(p) {
  margin: 0;
}
</style>
