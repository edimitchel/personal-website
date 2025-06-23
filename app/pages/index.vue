<template>
  <section>
    <ContentRenderer :value="home" class="text-center prose" />
  </section>
</template>

<script setup lang="ts">

definePageMeta({ title: 'Michel Edighoffer' })

const { data: home } = await useAsyncData('home', () => queryCollection('content').path('/home').first());
</script>
