<template>
  <section>
      <ContentRenderer :value="post" class="prose" />
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Blog'
})

const route = useRoute();

const { data: post } = await useAsyncData('post', () => queryCollection('articles').where('slug', '==', route.params.slug).first());

</script>
