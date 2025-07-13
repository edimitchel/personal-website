<template>
  <article>
    <main>
      <ContentRenderer v-if="content" :value="content" class="prose" />
      <div v-else class="prose">
        <h1>{{ $t('project.notFound') }}</h1>
        <p>{{ $t('project.notFoundDescription') }}</p>
        <NuxtLinkLocale to="/projects">{{ $t('project.goToProjects') }}</NuxtLinkLocale>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()

const { content, isTranslated } = await useTranslatedContent(
  'project-' + route.params.slug,
  queryCollection('projects').where('stem', 'LIKE', '%/' + route.params.slug + '%'),
)

useHead({
  title: 'Michel Edighoffer / ' + content?.title,
})

const store = layoutStore()
store.notTranslated = !isTranslated
</script>