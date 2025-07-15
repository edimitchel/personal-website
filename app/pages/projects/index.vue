<template>
  <section>
    <ContentRenderer v-if="project" :value="project" class="prose" />

    <NuxtLinkLocale v-if="projects?.length" v-for="p in projects" :key="p.slug" :to="'/projects/' + getProjectName(p)">
      <ContentRenderer :value="p" class="prose" excerpt />
    </NuxtLinkLocale>
    <div class="prose" v-else>
      <h3>{{ $t('project.noneForThisLanguage') }}</h3>
    </div>
  </section>
</template>

<script setup>
const store = layoutStore();
const { locale, t } = useI18n()

store.messages = [{ content: 'Développements (EI)', level: 1 }, { content: 'free lancing since 2023', level: 2 }];

const { content: project, isTranslated } = await useTranslatedContent('project', queryCollection('content').where('stem', 'LIKE', `%/project`));
const projects = await useTranslatedContent('projects', queryCollection('projects'), (projects) => projects.content);

function getProjectName(projectContent) {
  return projectContent.stem.split('/').at(-1);
}

store.notTranslated = !isTranslated

useHead(() => ({
  title: 'Michel Edighoffer / ' + t('header.projects'),
}))
</script>
