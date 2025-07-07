<template>
  <section>
    <ContentRenderer v-if="project" :value="project" class="prose" />

    <ContentRenderer v-if="projects" v-for="p in projects" :key="p.slug" :value="p" class="prose" excerpt />
  </section>
</template>

<script setup>
const store = layoutStore();
const { locale } = useI18n()

definePageMeta({
  title: 'Michel Edighoffer',
})

store.messages = [{content: 'Développements ®', level: 1}, {content: 'free lancing since 2023', level: 2}];

const project = await useContent('project-' + locale.value, () => queryCollection('content').path(`${locale.value === 'fr' ? '/fr' : ''}/project`).first());
const projects = await useContent('projects-' + locale.value, () => queryCollection('projects').where('lang', '=', locale.value).all());

</script>
