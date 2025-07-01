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

const blog = await useContent('blog', () => queryCollection('content').path('/blog').first());
const posts = await useContent('posts', () => queryCollection('articles').all());
</script>
