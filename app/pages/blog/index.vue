<template>
  <section>
    <ContentRenderer :value="blog" />

    <Posts :posts="posts" />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Blog'
})

const { data: blog } = await useAsyncData('blog', () => queryCollection('content').path('/blog').first());
const { data: posts } = await useAsyncData('posts', () => queryCollection('articles').all());
</script>
