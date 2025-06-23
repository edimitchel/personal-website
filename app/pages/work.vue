<template>
  <section>
    <ContentRenderer :value="about" class="prose" />
  </section>
</template>

<script setup>

definePageMeta({
  title: 'Michel Edighoffer',
})

const { data: about } = await useAsyncData('about', () => queryCollection('content').path('/about').first());

const store = layoutStore()

onMounted(() => {
  store.messages = [
    'full-stack engineer',
    'tech leader',
    'Nuxt expert',
    'Alsace ❤',
  ].sort(() => Math.random() - 0.5)
})
</script>
