<template>
  <a :href="'https://github.com/' + url" target="_blank" class="i-line-md:github"></a>
</template>
<script setup lang="ts">
defineProps<{ url: string }>()
</script>
<style scoped>
a {
  --uno:w-6 h-6 ;
}
</style>
