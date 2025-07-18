<template>
  <article>
    <main>
      <template v-if="content">
        <ContentRenderer :value="content" class="prose" />
        <SiblingNavigation v-if="siblings" :siblings="siblings" collection="projects" />

      </template>
      <div v-else class="prose">
        <h1>{{ $t('project.notFound') }}</h1>
        <p>{{ $t('project.notFoundDescription') }}</p>

        <SwitchLocalePathLink v-if="isTranslated" :locale="locale === 'fr' ? 'en' : 'fr'">
          {{ $t('article.switchLanguageForContent') }}
        </SwitchLocalePathLink>

        <NuxtLinkLocale v-else to="/projects">{{ $t('project.goToProjects') }}</NuxtLinkLocale>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
import { transformProject } from './index.vue'

const route = useRoute()
const { locale } = useI18n()

const { content, isTranslated } = await useTranslatedContent(
  `project-${route.params.slug}`,
  queryCollection('projects').where('stem', 'LIKE', '%/' + route.params.slug + '%'),
)

const { data: siblings } = content ? await useAsyncData(`project-siblings-${route.params.slug}`, () => queryCollectionItemSurroundings('projects', content.path, {
  fields: ['slug', 'title', 'stem']
}).order('completedAt', 'DESC'), { transform: siblings => siblings.map(transformProject) }) : { data: null }

const store = layoutStore()
if (content) {
  store.title = content.title
  
  if (content.image) {
    store.headerImage = { src: content.image, title: content.title };
  }
  useHead({
    title: 'Michel Edighoffer / ' + content?.title,
  })
}

store.notTranslated = !isTranslated
</script>