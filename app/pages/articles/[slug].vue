<template>
  <article>
    <main class="prose">
      <template v-if="content">
        <h1>{{ content.title }}</h1>
        <ContentRenderer :value="content" />
      </template>
      <div v-else>
        <h1>{{ $t('article.notFound') }}</h1>
        <p>{{ $t('article.notFoundDescription') }}</p>
        <NuxtLinkLocale to="/articles">{{ $t('article.goToArticles') }}</NuxtLinkLocale>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
const route = useRoute()
const { content, isTranslated } = await useTranslatedContent(
  'article-' + route.params.slug,
  queryCollection('articles').where('slug', '=', route.params.slug),
);

if (content) {
  useHead({
    title: 'Michel Edighoffer / ' + content.title,
  })
}

const store = layoutStore()
store.notTranslated = !isTranslated
</script>