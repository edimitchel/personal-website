<template>
  <section>
    <ContentRenderer :value="work" class="prose" />
  </section>
</template>

<script setup>

definePageMeta({
  title: 'Michel Edighoffer',
})

const { data: work } = await useAsyncData('work', () => queryCollection('content').path('/work').first());
</script>
