<template>
  <section>
    <ContentRenderer v-if="about" :value="about" :data="{ experiences }" class="prose text-background" />
  </section>
</template>

<script setup lang="ts">
import type { Experience } from '~/components/content/About.vue';
import { transformProject } from './projects/index.vue';

defineOgImageComponent('Page');

const appConfig = useAppConfig();
const { messages: storeMessages } = storeToRefs(layoutStore())

const messages = useState('randomIndex', () => appConfig.ui?.messages?.sort(() => Math.random() - 0.5))

if (messages.value) {
  storeMessages.value = messages.value
}

const store = layoutStore();

const { content: about, isTranslated } = await useTranslatedContent('about', queryCollection('pages').where('stem', 'LIKE', `%about`));

const experiences = await useTranslatedContent(
  'experiences',
  queryCollection('projects').where('type', 'IN', ['consulting', 'experience']).order('completedAt', 'DESC'),
  (projects): Experience[] => projects.content.map(transformProject) as Experience[]
);

store.title = 'Michel Edighoffer';

store.notTranslated = !isTranslated

if (about) {

  useHead({
    title: store.title + ' – ' + about?.title,
    meta: [
      {
        name: 'description',
        content: about?.description
      },
      {
        property: 'og:title',
        content: `${about?.title}`
      },
      {
        property: 'og:description',
        content: about?.description
      }
    ]
  })
}

if (about?.ogImage) {
  defineOgImage(about.ogImage)
}
</script>
