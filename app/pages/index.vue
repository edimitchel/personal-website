<template>
  <section>
    <ContentRenderer :value="home" />
  </section>
</template>

<script setup lang="ts">

definePageMeta({ title: 'Michel Edighoffer' })

const { data: home } = await useAsyncData('home', () => queryCollection('content').path('/home').first());
</script>
