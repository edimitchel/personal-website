<template>
  <a :href="'https://linkedin.com/in/' + username" target="_blank" class="i-line-md:linkedin"></a>
</template>
<script setup lang="ts">
defineProps<{ username: string }>()
</script>
<style scoped>
a {
  --uno:w-6 h-6 ;
}
</style>
