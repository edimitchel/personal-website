<template>
  <article>
    <header></header>
    <main>
      <ContentRenderer v-if="post" :value="post" class="prose" />
      <div v-else class="prose">
        <h1>Article Not Found</h1>
        <p>Oops! The article you're looking for doesn't exist.</p>
        <NuxtLink to="/blog">Go back home</NuxtLink>
      </div>
    </main>
  </article>
</template>

<script setup lang="ts">
const route = useRoute();

const post = await useContent('post', () => queryCollection('articles').where('slug', '=', route.params.slug).first());

</script>
