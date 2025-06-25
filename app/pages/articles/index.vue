<template>
  <div>
    <ContentRenderer v-if="blog" :value="blog" class="prose" />

    <Posts :posts="posts" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Blog'
})

const { data: blog } = await useAsyncData('blog', () => queryCollection('content').path('/blog').first());
const { data: posts } = await useAsyncData('posts', () => queryCollection('articles').all());
</script>
