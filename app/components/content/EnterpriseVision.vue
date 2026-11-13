<template>
  <div>
    <h4 class="m-0 mb-2 text-2xl font-semibold">
      Vision
    </h4>
    <div class="text-tone-600 m-0 leading-relaxed text-balance">
      <slot />
    </div>
  </div>
</template>

<style scoped>
div :deep(p) {
  margin: 0;
}
</style>
