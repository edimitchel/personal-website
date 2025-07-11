<template>
  <div>
    <ContentRenderer v-if="blog" :value="blog" class="prose" />

    <Posts v-if="posts" :posts="posts" />
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

useHead(() => ({
  title: () => 'Michel Edighoffer / Articles'
}))

const blog = await useContent('blog-' + locale.value, () => queryCollection('content').path(`/pages${locale.value === 'fr' ? '/fr' : ''}/blog`).first());
const posts = await useContent('articles-' + locale.value, () => queryCollection('articles').where('lang', '=', locale.value).order('created', 'DESC').all());

</script>
