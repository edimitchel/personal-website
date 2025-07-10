<template>
  <section>
    <ContentRenderer v-if="project" :value="project" class="prose" />

    <NuxtLinkLocale v-if="projects" v-for="p in projects" :key="p.slug" :to="'/projects/' + getProjectName(p)">
      <ContentRenderer :value="p" class="prose" excerpt />
    </NuxtLinkLocale>
  </section>
</template>

<script setup>
const store = layoutStore();
const { locale, t } = useI18n()

definePageMeta({
  title: 'Michel Edighoffer',
})

store.messages = [{ content: 'Développements ®', level: 1 }, { content: 'free lancing since 2023', level: 2 }];

const project = await useContent('project-' + locale.value, () => queryCollection('content').path(`${locale.value === 'fr' ? '/fr' : ''}/project`).first());
const projects = await useContent('projects-' + locale.value, () => queryCollection('projects').where('lang', '=', locale.value).all());

function getProjectName(projectContent) {
  return projectContent.stem.split('/').at(-1);
}

useHead(() => ({
  title: 'Michel Edighoffer / ' + t('header.projects'),
}))
</script>
