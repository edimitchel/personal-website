<template>
  <article>
    <header class="flex justify-center">
      <button
        class="cursor-pointer px-2 text-xs text-gray-600 border-(1 solid black opacity-20) rounded-full hover:(bg-gray-100 text-gray-900 dark:bg-gray-800 border-opacity-100)"
        @click="switchLanguage(lang)" v-for="lang in otherLanguagesContent">
        {{ $t(`article.read-in`) }}
      </button>
    </header>
    <main>
      <ContentRenderer v-if="currentContent" :value="currentContent" class="prose" />
      <div v-else class="prose">
        <h1>{{ $t('article.notFound') }}</h1>
        <p>{{ $t('article.notFoundDescription') }}</p>
        <NuxtLink to="/articles">{{ $t('article.goToArticles') }}</NuxtLink>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const content = {
  en: await useContent('article_en' + route.params.slug,
    () => queryCollection('articles').where('slug', '=', route.params.slug).first()),
  fr: await useContent('article_fr' + route.params.slug,
    () => queryCollection('articles_fr').where('slug', '=', route.params.slug).first())
};

const currentContent = computed(() => {
  const selectedContent = content[locale.value as keyof typeof content]
  return unref(selectedContent) ?? null
})

const otherLanguagesContent = computed(() => {
  const langsWithContent = Object.entries(content).filter(([lang, value]) => unref(value) && lang !== locale.value).map(([lang]) => lang)
  return langsWithContent as (keyof typeof content)[];
})

const switchLanguage = (lang: keyof typeof content) => {
  const localePath = useSwitchLocalePath();
  navigateTo(localePath(lang))
}
</script>