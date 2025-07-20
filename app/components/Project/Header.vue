<template>
  <header class="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-start gap-6 mb-6">
      <div class="flex-1 min-w-0">
        <p v-if="project.organization" class="text-lg text-center text-gray-600 dark:text-gray-200 mb-3">
          {{ project.organization }}
        </p>
        <p v-if="project.description" class="text-center text-balance ext-gray-600 dark:text-gray-200 text-base leading-relaxed">
          {{ project.description }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pb-2">
      <!-- Project Type & Categories -->
      <ProjectInfo 
        v-if="project.type || project.categories?.length"
        :title="$t('project.info.typeAndCategories')"
        icon="i-heroicons-tag"
      >
        <ProjectTypeBadge v-if="project.type" :type="project.type" class="mb-2" />
        <ProjectCategoryList v-if="project.categories?.length" :categories="project.categories" />
      </ProjectInfo>

      <!-- Technologies -->
      <ProjectInfo 
        v-if="project.technologies?.length"
        :title="$t('project.info.technologies')"
        icon="i-heroicons-code-bracket"
      >
        <ProjectTechStack :technologies="project.technologies" />
      </ProjectInfo>
    </div>
    <!-- Project Details -->
    <ProjectInfo 
        v-if="project.url || project.completedAt"
        :title="$t('project.info.details')"
        icon="i-heroicons-information-circle"
      >
        <div class="space-y-2">
          <div v-if="project.url" class="flex items-center gap-2">
            <i class="i-heroicons-link text-gray-400 w-4 h-4" />
            <a 
              :href="project.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-gray-600 dark:text-gray-200 hover:underline text-sm"
            >
              {{ $t('project.info.visitProject') }}
            </a>
          </div>
          <div v-if="project.completedAt" class="flex items-center gap-2">
            <i class="i-mdi-calendar text-gray-400 w-4 h-4" />
            <span class="text-gray-600 dark:text-gray-300 text-sm">
              {{ formatDate(project.completedAt) }}
            </span>
          </div>
        </div>
      </ProjectInfo>
  </header>
</template>

<script setup lang="ts">
import type { ProjectsCollectionItem } from '@nuxt/content'

type ExtendedProject = ProjectsCollectionItem & {
  url?: string
  organization?: string
  categories?: string[]
  technologies?: string[]
  completedAt?: string
}

interface Props {
  project: ExtendedProject
}

defineProps<Props>()

const { locale } = useI18n()

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script>
