<template>
  <div class="github">
    <a :href="'https://github.com/' + username" target="_blank" class="i-line-md:github"></a>
  </div>
</template>
<script setup lang="ts">
defineProps<{ username: string }>()
</script>
<style scoped>
.github {
  --uno:w-6 h-6 p-1 flex items-center text-center rounded-full transition(ease duration-200 all) hover:(bg-gray-200 scale-125 z-1000);
}
.github a {
  --uno:w-full h-full;
}
</style>
