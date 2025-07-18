<template>
  <section>
    <ContentRenderer v-if="project" :value="project" class="prose" />
    
    <NuxtLinkLocale v-if="projects?.length" v-for="p in projects" :key="p.slug" :to="'/projects/' + p.slug">
      <ContentRenderer :value="p" class="prose" excerpt />
    </NuxtLinkLocale>
    <div class="prose" v-else>
      <h3>{{ $t('project.noneForThisLanguage') }}</h3>
    </div>
  </section>
</template>

<script lang="ts">

function getProjectName(projectContent: PagesCollectionItem | ContentNavigationItem) {
  return projectContent.stem?.split('/').at(-1);
}

export const transformProject = (project: PagesCollectionItem | ContentNavigationItem) => ({...project, slug: getProjectName(project)});
</script>
<script setup lang="ts">
import type { PagesCollectionItem, ContentNavigationItem } from '@nuxt/content';

const store = layoutStore();
const { t } = useI18n()

store.messages = [{ content: 'Développements (EI)', level: 1 }, { content: 'free lancing since 2023', level: 2 }];

store.color = ['#13D38E', '#13D38E']

const { content: project, isTranslated } = await useTranslatedContent('project', queryCollection('pages').where('stem', 'LIKE', `%/project`));
const projects = await useTranslatedContent('projects', queryCollection('projects').order('completedAt', 'DESC'), projects => projects.content.map(transformProject));

store.notTranslated = !isTranslated

useHead(() => ({
  title: 'Michel Edighoffer / ' + t('header.projects'),
}))
</script>
