<template>
  <div class="linkedin">
    <a :href="'https://linkedin.com/in/' + username" target="_blank" class="i-line-md:linkedin"></a>
  </div>
</template>
<script setup lang="ts">
defineProps<{ username: string }>()
</script>
<style scoped>
.linkedin {
  --uno: w-6 h-6 p-1 flex items-center text-center rounded-full transition(ease duration-200 all) hover:(bg-gray-200 scale-125 z-1000);
}
.linkedin a {
  --uno: w-full h-full;
}
</style>
