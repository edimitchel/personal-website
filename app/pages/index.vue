<template>
  <section>
    <ContentRenderer v-if="about" :value="about" :data="{ experiences }" class="prose" />
  </section>
</template>

<script setup lang="ts">
import type { Experience } from '~/components/content/About.vue';

const appConfig = useAppConfig();
const { locale } = useI18n()

const { messages: storeMessages } = storeToRefs(layoutStore())

const messages = useState('randomIndex', () => appConfig.ui?.messages?.sort(() => Math.random() - 0.5))

if (messages.value) {
  storeMessages.value = messages.value
}

const store = layoutStore();

store.title = 'Michel Edighoffer'

const about = await useContent('about-' + locale.value, () => queryCollection('content').path(`/pages${locale.value === "fr" ? '/fr' : ''}/about`).first());

const experiences = await useTranslatedContent(
  'experiences', 
  queryCollection('projects').where('type', 'IN', ['consulting', 'experience']), 
  (projects): Experience[] => projects.content.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    icons: p.icons,
    organization: p.organization
  }))
);

useHead({
  title: store.title + ' – ' + about?.value?.title,
  meta: [
    {
      name: 'description',
      content: about?.value?.description
    },
    {
      property: 'og:title',
      content: `${about?.value?.title}`
    },
    {
      property: 'og:description',
      content: about?.value?.description
    }
  ]
})
</script>
