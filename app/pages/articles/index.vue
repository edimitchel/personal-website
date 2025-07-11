<template>
  <div>
    <ContentRenderer v-if="blog" :value="blog" class="prose" />

    <Posts v-if="posts" :posts="posts" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Articles'
})

const { locale } = useI18n()

const blog = await useContent('blog', () => queryCollection('content').path(`/pages${locale.value === 'fr' ? '/fr' : ''}/blog`).first());
const posts = await useContent('posts', () => queryCollection('articles').where('lang', '=', locale.value).all());

useHead(() => ({
  title: 'Michel Edighoffer / Articles'
}))
</script>
