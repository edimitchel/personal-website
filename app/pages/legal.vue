<template>
    <ContentRenderer v-if="content" :value="content" class="prose text-ink" :data="{ updatedDate }" />
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
    color: var(--site-ink);
}

:deep(.prose h1) {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--site-ink);
}

:deep(.prose h2) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    margin-top: 1.5rem;
    color: var(--site-ink);
}

:deep(.prose p) {
    margin-bottom: 1rem;
    color: color-mix(in srgb, var(--site-ink) 90%, transparent);
}

:deep(.prose ul) {
    margin-bottom: 1rem;
    color: color-mix(in srgb, var(--site-ink) 90%, transparent);
}

:deep(.prose li) {
    margin-bottom: 0.25rem;
    color: color-mix(in srgb, var(--site-ink) 90%, transparent);
}
</style>
