<template>
  <NuxtLayout>
    <NuxtPage :transition="{
      onBeforeEnter,
    }" />
  </NuxtLayout>
</template>
<script setup lang="ts">
const { finalizePendingLocaleChange } = useI18n();

const onBeforeEnter = async () => {
  await finalizePendingLocaleChange();
}
</script>
<style>
html,
body,
#app {
  height: 100%
}

#app {
  display: flex;
  flex-direction: column;
}
</style>