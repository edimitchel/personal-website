<template>
  <article>
    <main>
      <ContentRenderer v-if="content" :value="content" class="prose" />
      <div v-else class="prose">
        <h1>{{ $t('project.notFound') }}</h1>
        <p>{{ $t('project.notFoundDescription') }}</p>
        <NuxtLink to="/projects">{{ $t('project.goToProjects') }}</NuxtLink>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const content = await useContent(
  'project-' + locale.value + '-' + route.params.slug,
  () => queryCollection('projects').where('lang', '=', locale.value).where('stem', 'LIKE', '%/' + route.params.slug + '%').first(),
  { onFailure: () => { } }
);

useHead({
  title: 'Michel Edighoffer / ' + content?.value?.title,
})
</script>