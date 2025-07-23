<template>
    <div v-if="projects.length" class="mb-12">
        <h2 class="text-2xl font-bold mb-6 text-primary-800 dark:text-primary-200">
            {{ projects.length }} {{ title }}
        </h2>
        <div class="grid gap-4" data-allow-mismatch>
            <ProjectCard v-for="p in displayedProjects" :key="p.slug" :project="p" />
        </div>

        <!-- Show More Button -->
        <ClientOnly>
            <div v-if="projects.length > initialCount" class="mt-4 text-center">
                <button @click="toggleShowAll"
                    class="px-6 py-1 bg-primary/80 hover:bg-background text-primary-200 cursor-pointer rounded-md transition-colors duration-200">
                    {{ showAll ? $t('projects.showLess') : $t('projects.showMore', {
                        count: projects.length -
                    initialCount }) }}
                </button>
            </div>
        </ClientOnly>
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
    if (showAll.value || props.projects.length <= props.initialCount || import.meta.server) {
        return props.projects
    }
    return props.projects.slice(0, props.initialCount)
})

const toggleShowAll = () => {
    showAll.value = !showAll.value
}
</script>
