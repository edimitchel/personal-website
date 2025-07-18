<template>
  <article>
    <main class="prose">
      <template v-if="content">
        <span class="block text-center text-sm">{{ formatDate(content.created) }}</span>
        <h1 class="mt-0">{{ content.title }}</h1>
        <NuxtImg v-if="content.thumbnail" class="my-2 w-full max-h-40 md:max-h-50 object-cover" :src="content.thumbnail" :alt="content.title" />
        <ContentRenderer :value="content" />

        <SiblingNavigation v-if="siblings" :siblings="siblings" collection="articles" />
      </template>
      <div v-else>
        <h1>{{ $t('article.notFound') }}</h1>
        <p>{{ $t('article.notFoundDescription') }}</p>
        <SwitchLocalePathLink v-if="isTranslated" :locale="locale === 'fr' ? 'en' : 'fr'">
          {{ $t('article.switchLanguageForContent') }}
        </SwitchLocalePathLink>

        <NuxtLinkLocale v-else to="/articles">{{ $t('article.goToArticles') }}</NuxtLinkLocale>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { locale } = useI18n()

const { content, isTranslated } = await useTranslatedContent(
  `article-${route.params.slug}`,
  queryCollection('articles').where('slug', '=', route.params.slug),
);

const { data: siblings } = content ? await useAsyncData(`siblings-articles-${route.params.slug}`, () => queryCollectionItemSurroundings('articles', content?.path, {
  fields: ['slug', 'title']
}).order('created', 'DESC')) : { data: null }

const store = layoutStore()
if (content) {
  store.title = content.title

  useHead({
    title: 'Michel Edighoffer / ' + content.title,
  })
  if(content.thumbnail) {
    store.headerCover = content.thumbnail;
  }
}

store.notTranslated = !isTranslated

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>