<template>
  <section>
    <ContentRenderer :value="work" class="prose" />
  </section>
</template>

<script setup>
const store = layoutStore();

definePageMeta({
  title: 'Michel Edighoffer',
})

const { data: work } = await useAsyncData('work', () => queryCollection('content').path('/work').first());

store.messages = ['Développements'];
</script>
