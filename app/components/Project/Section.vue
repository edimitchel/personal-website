<template>
  <div v-if="projects.length" class="mb-12">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
      {{ projects.length }} {{ title }} 
    </h2>
    <div class="grid gap-4">
      <ProjectCard 
        v-for="p in displayedProjects" 
        :key="p.slug" 
        :project="p"
      />
    </div>
    
    <!-- Show More Button -->
    <div v-if="projects.length > initialCount" class="mt-4 text-center">
      <button
        @click="toggleShowAll"
        class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 cursor-pointer rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {{ showAll ? $t('projects.showLess') : $t('projects.showMore', { count: projects.length - initialCount }) }}
        <span class="ml-1">
          {{ showAll ? '↑' : '↓' }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content';

interface Props {
  projects: ProjectsCollectionItem[]
  title: string
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 4
})

const showAll = ref(false)

const displayedProjects = computed(() => {
  if (showAll.value || props.projects.length <= props.initialCount) {
    return props.projects
  }
  return props.projects.slice(0, props.initialCount)
})

const toggleShowAll = () => {
  showAll.value = !showAll.value
}
</script>
