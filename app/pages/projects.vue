<template>
  <section>
    <ContentRenderer :value="project" class="prose" />

    <ContentRenderer v-for="project in projects" :key="project.slug" :value="project" class="prose" excerpt />
  </section>
</template>

<script setup>
const store = layoutStore();

definePageMeta({
  title: 'Michel Edighoffer',
})

store.messages = [{content: 'Développements ®', level: 1}, {content: 'free lancing since 2023', level: 2}];

const project = await useContent('project', () => queryCollection('content').path('/project').first());
const projects = await useContent('projects', () => queryCollection('projects').all());

</script>
