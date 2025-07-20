<template>
  <NuxtLinkLocale 
    :to="'/projects/' + project.slug"
    class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
  >
    <div class="flex items-start gap-4">
      <NuxtImg 
        v-if="project.image" 
        :src="project.image" 
        :alt="project.title"
        class="w-16 h-16 object-contain rounded-lg flex-shrink-0"
      />
      <div class="flex-1 min-w-0">
        <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {{ project.title }}
        </h3>
        <p v-if="project.organization" class="text-sm text-gray-600 dark:text-gray-200 mb-2">
          {{ project.organization }}
        </p>
        <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
          {{ project.description }}
        </p>
        <div v-if="project.technologies" class="flex flex-wrap gap-1">
          <span 
            v-for="tech in project.technologies.slice(0, 4)" 
            :key="tech"
            class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
          >
            {{ tech }}
          </span>
          <span v-if="project.technologies.length > 4" class="px-2 py-1 text-xs text-gray-500">
            +{{ project.technologies.length - 4 }}
          </span>
        </div>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

interface Props {
  project: ProjectsCollectionItem & { slug: string }
}

defineProps<Props>()
</script>
