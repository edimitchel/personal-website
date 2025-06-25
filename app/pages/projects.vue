<template>
  <section>
    <ContentRenderer :value="work" class="prose" />

    <ContentRenderer v-for="project in projects" :key="project.slug" :value="project" class="prose" excerpt />
  </section>
</template>

<script setup>
const store = layoutStore();

definePageMeta({
  title: 'Michel Edighoffer',
})

const work = await useContent('work', () => queryCollection('content').path('/work').first());
const projects = await useContent('projects', () => queryCollection('projects').all());

store.messages = ['Développements'];
</script>
