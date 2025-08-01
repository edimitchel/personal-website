<template>
  <NuxtLinkLocale :to="'/projects/' + project.slug"
    class="block p-3 py-4 bg-foreground text-foreground rounded-lg shadow-sm shadow-primary/40 hover:shadow-md transition-shadow duration-200 group">
    <div class="flex items-start gap-3">
      <div class="w-18 flex flex-col items-center gap-1 text-background">
        <NuxtImg v-if="project.image" :src="project.image" :alt="project.title"
          class="w-16 h-16 object-contain rounded-lg flex-shrink-0" />
        <div v-if="project.completedAt" class="text-sm">{{ new Date(project.completedAt).getFullYear() }}</div>
      </div>
      <div class="flex flex-col flex-1 min-w-0">
        <h3 class="text-xl font-semibold text-primary-900 dark:text-primary-100">
          {{ project.title }}
        </h3>
        <p v-if="project.organization" class="text-sm font-bold text-primary-600 dark:text-primary-200">
          {{ project.organization }}
        </p>
        <p class="text-primary-600 dark:text-primary-300 text-sm line-clamp-2">
          {{ project.description }}
        </p>
        <div v-if="project.technologies" class="flex flex-wrap gap-1 pt-2">
          <TechStack :technologies="project.technologies" :hiddenMoreThan="4" />
        </div>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'
import TechStack from './TechStack.vue';

interface Props {
  project: ProjectsCollectionItem & { slug: string }
}

defineProps<Props>()
</script>
