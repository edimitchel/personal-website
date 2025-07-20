<template>
  <section>
    <ContentRenderer v-if="project" :value="project" class="prose" />
    
    <div v-if="projects?.length">
      <!-- Experience + Consulting -->
      <div v-if="experienceConsultingProjects.length" class="mb-12">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          {{ $t('projects.experienceConsulting') }}
        </h2>
        <div class="grid gap-6">
          <ProjectCard 
            v-for="p in experienceConsultingProjects" 
            :key="p.slug" 
            :project="p"
          />
        </div>
      </div>

      <!-- Personal Projects -->
      <div v-if="personalProjects.length" class="mb-12">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          {{ $t('projects.personal') }}
        </h2>
        <div class="grid gap-6">
          <ProjectCard 
            v-for="p in personalProjects" 
            :key="p.slug" 
            :project="p"
          />
        </div>
      </div>
    </div>
    
    <div class="prose" v-else>
      <h3>{{ $t('project.noneForThisLanguage') }}</h3>
    </div>
  </section>
</template>

<script lang="ts">
function getProjectName(projectContent: PagesCollectionItem | ContentNavigationItem) {
  return projectContent.stem?.split('/').at(-1);
}

export const transformProject = (project: (PagesCollectionItem | ProjectsCollectionItem) | ContentNavigationItem) => ({...project, slug: getProjectName(project)});
</script>
<script setup lang="ts">
import type { PagesCollectionItem, ContentNavigationItem, ProjectsCollectionItem } from '@nuxt/content';

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
</script>
