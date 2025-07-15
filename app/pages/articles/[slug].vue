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