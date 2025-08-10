<template>
    <ContentRenderer v-if="content" :value="content" class="prose text-background" :data="{ updatedDate }" />
</template>

<script setup lang="ts">
const {locale} = useI18n()
const { content, isTranslated } = await useTranslatedContent('legal', queryCollection('pages').where('stem', 'LIKE', `%legal`))

useHead({
    title: content?.title,
    meta: [
        {
            name: 'description',
            content: content?.description
        }
    ]
})

const store = layoutStore()

store.notTranslated = !isTranslated

const updatedDate = computed(() => {
    return new Date(content?.updated).toLocaleDateString(locale.value, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
})
</script>

<style scoped>
:deep(.prose) {
    color: var(--color-foreground);
}

:deep(.prose h1) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--color-foreground);
}

:deep(.prose h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    margin-top: 1.5rem;
    color: var(--color-foreground);
}

:deep(.prose p) {
    margin-bottom: 1rem;
    color: rgba(var(--color-foreground), 0.9);
}

:deep(.prose ul) {
    margin-bottom: 1rem;
    color: rgba(var(--color-foreground), 0.9);
}

:deep(.prose li) {
    margin-bottom: 0.25rem;
    color: rgba(var(--color-foreground), 0.9);
}
</style>
