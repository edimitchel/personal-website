<template>
  <header class="mb-8 pb-6 border-b border-primary-200">
    <div class="flex items-start gap-6 mb-6">
      <div class="flex-1 min-w-0">
        <p v-if="project.organization" class="text-lg text-center text-primary-600 mb-3">
          {{ project.organization }}
        </p>
        <p v-if="project.description" class="text-center text-balance text-background text-base leading-relaxed">
          {{ project.description }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 pb-2">
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
            <i class="i-heroicons-link text-primary-400 w-4 h-4" />
            <NuxtLink
              :to="project.url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-primary-600 hover:underline text-sm"
            >
              {{ $t('project.info.visitProject') }}
            </NuxtLink>
          </div>
          <div v-if="project.completedAt" class="flex items-center gap-2">
            <i class="i-mdi-calendar text-primary-400 w-4 h-4" />
            <span class="text-primary-600 dark:text-primary-300 text-sm">
              <template v-if="project.startedAt">{{ formatDate(project.startedAt) }} – </template> {{ formatDate(project.completedAt) }}
            </span>
          </div>
          <div v-if="project.relatedArticleSlug" class="flex items-center gap-2">
            <i class="i-mdi-book-open-page-variant text-primary-400 w-4 h-4" />
            <NuxtLinkLocale
              :to="`/articles/${project.relatedArticleSlug}`" 
              class="text-primary-600 hover:underline text-sm"
            >
              {{ $t('project.info.readArticle') }}
            </NuxtLinkLocale>
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
  }).format(date)
}
</script>
