<template>
  <div>
    <ContentRenderer v-if="blog" :value="blog" class="prose text-ink" />

    <Posts v-if="posts" :posts="posts" />
  </div>
</template>

<script setup lang="ts">
defineOgImage('Page');


const { content: blog, isTranslated } = await useTranslatedContent('blog', queryCollection('pages').where('stem', 'LIKE', `%blog`));
const posts = await useTranslatedContent('articles', queryCollection('articles').order('created', 'DESC'), (articles) => articles.content);

const store = layoutStore()
store.notTranslated = !isTranslated

useHead(() => ({
  title: () => 'Michel Edighoffer / Articles'
}))

defineContentOgImage(blog?.ogImage)
</script>
