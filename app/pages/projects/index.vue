<template>
  <section class="prose">
    <ContentRenderer v-if="project" :value="project" class="prose text-background" />

    <div v-if="projects?.length">
      <!-- Experience + Consulting -->
      <ProjectSection :projects="experienceConsultingProjects" :title="$t('projects.experienceConsulting')" />

      <!-- Personal Projects -->
      <ProjectSection :projects="personalProjects" :title="$t('projects.personal')" />
    </div>

    <div class="prose text-background" v-else>
      <h3>{{ $t('project.noneForThisLanguage') }}</h3>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content';
import { transformProject } from '~/utils/transformProject';

defineOgImage('Page');

const store = layoutStore();
const { t } = useI18n()

store.messages = [
  { content: 'Développements (EI)', level: 1 },
  { content: 'free lancing since 2023', level: 2 }
];

const { content: project, isTranslated } = await useTranslatedContent('project', queryCollection('pages').where('stem', 'LIKE', `%/project`));
const projects = await useTranslatedContent('projects', queryCollection('projects').order('completedAt', 'DESC'), projects => projects.content.map(transformProject) as (ProjectsCollectionItem[]));

// Group projects by type
const experienceConsultingProjects = computed(() =>
  projects?.filter(p => ['experience', 'consulting'].includes(p.type)) ?? []
);

const personalProjects = computed(() =>
  projects?.filter(p => !['experience', 'consulting'].includes(p.type)) ?? []
);

store.notTranslated = !isTranslated

useHead(() => ({
  title: 'Michel Edighoffer / ' + t('header.projects'),
}))


if (project?.ogImage) {
  defineOgImage(project.ogImage)
}
</script>
