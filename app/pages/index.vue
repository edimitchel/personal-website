<template>
  <section>
    <ContentRenderer v-if="about" :value="about" :data="{ experiences }" class="prose text-background" />
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

const { content: about, isTranslated } = await useTranslatedContent('about', queryCollection('pages').path(`/pages${locale.value === "fr" ? '/fr' : ''}/about`));

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
</script>
