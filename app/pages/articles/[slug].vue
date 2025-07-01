<template>
  <article>
    <header>
      <button
        class="cursor-pointer px-2 text-xs border-(1 solid black) rounded-full hover:(bg-gray-100 dark:bg-gray-800)"
        @click="toggleTranslation(lang)" v-for="lang in otherLanguagesContent">
        {{ lang === 'fr' ? 'Lire en français' : 'Read in English' }}
      </button>
    </header>
    <main>
      <ContentRenderer v-if="currentContent" :value="currentContent" class="prose" />
      <div v-else class="prose">
        <h1>Article Not Found</h1>
        <p>Oops! The article you're looking for doesn't exist.</p>
        <NuxtLink to="/articles">Go to articles</NuxtLink>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const preferredLanguage = useState('preferredLanguage', () => 'en')

const content = {
  en: await useContent('article_en',
    () => queryCollection('articles').where('slug', '=', route.params.slug).first(), {
  }),
  fr: await useContent('article_fr',
    () => queryCollection('articles_fr').where('slug', '=', route.params.slug).first(), {
    onSuccess: () => {
      console.log('Article trouvé')
    },
    onFailure: () => {
      console.log('Article non trouvé')
    },
  })
};

const currentContent = computed(() => {
  const selectedContent = content[preferredLanguage.value as keyof typeof content]
  return unref(selectedContent) ?? null
})

const otherLanguagesContent = computed(() => {
  const langsWithContent = Object.entries(content).filter(([lang, value]) => unref(value) && lang !== preferredLanguage.value).map(([lang]) => lang)
  return langsWithContent as (keyof typeof content)[];
})

const toggleTranslation = (lang: keyof typeof content) => {
  preferredLanguage.value = lang
}
</script>