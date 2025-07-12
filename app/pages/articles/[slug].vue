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
const { locale } = useI18n()

const content = await useContent(
  'article-' + locale.value + '-' + route.params.slug,
  () => queryCollection('articles').where('lang', '=', locale.value).where('slug', '=', route.params.slug).first(),
  { onFailure: () => { } }
);

if(content?.value) {
  useHead({
    title: 'Michel Edighoffer / ' + content?.value?.title,
  })
}
</script>